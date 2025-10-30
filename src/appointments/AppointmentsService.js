/*
 * ========================================================================
 * ARQUIVO: src/appointments/AppointmentsService.js (V50)
 * RESPONSABILIDADE: Camada de Lógica de Negócios (Business Logic).
 * Orquestra repositórios (Appointments, User), valida dados,
 * verifica conflitos e lança erros amigáveis para o frontend.
 * ========================================================================
 */

// Repositórios (nossas dependências)
import AppointmentsRepository from "./AppointmentsRepository.js";
import UserRepository from "../user/UserRepository.js"; // Assume que está em ../user/

// Helpers
import convertTimeForNumber from "../helpers/convertTimeForNumber.js";
const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class AppointmentsService {
  
  // PhD Note: Injeção de Dependência
  // Em uma V60+, os repositórios seriam injetados no construtor
  // constructor(AppointmentsRepository, UserRepository) { ... }
  // Mas para manter seu padrão de singleton, nós os acessamos estaticamente.

  /**
   * [V50] Lógica de Negócios: Verifica conflito de horários.
   * Lança um erro amigável se houver sobreposição.
   */
  async checkConflict({ doctorId, date, newStartTime, newEndTime, appointmentIdToExclude = null }) {
    const existingAppointments =
      await AppointmentsRepository.findAppointmentsByDoctorAndDate({
        doctorId,
        date,
        appointmentIdToExclude,
      });

    for (const app of existingAppointments) {
      // Lógica de conflto: (NovoInício < FimExistente) E (NovoFim > InícioExistente)
      if (newStartTime < app.endTime && newEndTime > app.startTime) {
        throw new Error(
          `Horário indisponível (${newStartTime}-${newEndTime}). Já existe uma consulta agendada das ${app.startTime} às ${app.endTime}.`
        );
      }
    }
  }

  /**
   * [V50] Lógica de Negócios: Lista vagas, calculando quais estão cheias.
   */
  async listSchedules() {
    try {
      // 1. Busca todos os agendamentos e suas vagas
      const appointments = await AppointmentsRepository.getAllAppointmentsForScheduleCalc();

      const hoursBySchedule = {};

      // 2. Calcula as horas ocupadas vs. totais de CADA vaga
      appointments.forEach((app) => {
        const {
          "schedule.id": scheduleId,
          "schedule.startTime": scheduleStartTime,
          "schedule.endTime": scheduleEndTime,
          startTime: appointmentStartTime,
          endTime: appointmentEndTime,
        } = app;

        // Evita erro se o agendamento estiver órfão
        if (!scheduleId) return; 

        const hoursToWorkByPatient = convertTimeForNumber(
          appointmentStartTime,
          appointmentEndTime
        );

        if (!hoursBySchedule[scheduleId]) {
          const hoursToWorkByDoctor = convertTimeForNumber(
            scheduleStartTime,
            scheduleEndTime
          );
          hoursBySchedule[scheduleId] = {
            totalHours: 0,
            hoursToWorkByDoctor,
          };
        }

        hoursBySchedule[scheduleId].totalHours += hoursToWorkByPatient;
      });

      // 3. Cria lista de IDs de vagas que estão cheias
      const schedulesCompleteIds = [];
      for (const [scheduleId, data] of Object.entries(hoursBySchedule)) {
        if (data.totalHours >= data.hoursToWorkByDoctor) {
          schedulesCompleteIds.push(scheduleId);
        }
      }

      // 4. Busca no repositório APENAS as vagas disponíveis
      const availableSchedules =
        await AppointmentsRepository.getSchedulesAvailable(schedulesCompleteIds);

      // 5. Adiciona links HATEOAS (lógica de serviço)
      return availableSchedules.map((schedule) => {
        const scheduleJson = schedule.toJSON(); // Assegura que é um objeto
        return {
          ...scheduleJson,
          links: {
            create: `${baseUrl}${API_PREFIX}/appointments/${schedule.id}`,
          },
        };
      });
    } catch (error) {
      console.error("[Service] Erro em listSchedules:", error.message);
      throw new Error(`Erro ao listar vagas: ${error.message}`);
    }
  }

  /**
   * [V50] Lógica de Negócios: Cria um novo agendamento.
   */
  async createAppointments(scheduleId, secretaryId, appointmentData) {
    try {
      // 1. Desestrutura e Valida dados de entrada
      const { email, startTime, endTime, status, descricao } = appointmentData;
      if (!email || !startTime || !endTime) {
        throw new Error("Email, startTime e endTime são obrigatórios.");
      }

      // 2. Orquestração: Busca dados de outros repositórios
      const patient = await UserRepository.findByUserNameOrEmail(email);
      if (!patient) {
        throw new Error("Usuário (paciente) não encontrado com este email.");
      }
      const patientId = patient.id;

      const schedule = await AppointmentsRepository.findScheduleById(scheduleId);
      const doctorId = schedule.doctorId;
      const date = schedule.dayOfWeek; // Lógica V3: 'dayOfWeek' é a data "YYYY-MM-DD"
      
      // 3. Lógica de Negócios: Validação de Horários (V20.1)
      const scheduleStartTime = schedule.startTime.slice(0, 5);
      const scheduleEndTime = schedule.endTime.slice(0, 5);

      if (startTime < scheduleStartTime || endTime > scheduleEndTime) {
        throw new Error(
          `Consulta fora do horário da agenda. Disponível: ${scheduleStartTime} - ${scheduleEndTime}`
        );
      }

      // 4. Lógica de Negócios: Verificação de Conflito
      await this.checkConflict({ doctorId, date, newStartTime: startTime, newEndTime: endTime });

      // 5. Preparação do DTO para o Repositório
      const appointmentDTO = {
        startTime,
        endTime,
        status: status || "agendado",
        descricao,
        scheduleId,
        patientId,
        doctorId,
        secretaryId,
        date,
      };

      // 6. Chamada ao Repositório
      const newAppointment = await AppointmentsRepository.create(appointmentDTO);

      // 7. Lógica de Negócios (Side-effect): Atualiza a data na VAGA (Lógica V3)
      // PhD Note: Isso é um efeito colateral estranho, mas mantido
      // para compatibilidade.
      try {
        await AppointmentsRepository.updateSchedule(scheduleId, { 
          dateOfWeek: date, // O 'dateOfWeek'
          dayOfWeek: date  // O 'dayOfWeek' (ambos atualizados para a data da consulta)
        });
      } catch (updateError) {
        console.warn(`[Service] FALHA (não fatal) ao atualizar Schedule ${scheduleId} após criação de consulta: ${updateError.message}`);
        // Não lançamos o erro aqui, pois a consulta FOI criada.
      }

      return newAppointment;

    } catch (error) {
      console.error("[Service] Erro em createAppointments:", error.message);
      // Lança um erro que o 'errorTranslator.js' do frontend pode entender
      throw new Error(`Erro ao criar consulta: ${error.message}`);
    }
  }

  /**
   * [V50] Lógica de Negócios: Lista todas as consultas detalhadas.
   */
  async listAllAppointments() {
    try {
      const appointments = await AppointmentsRepository.getAllAppointmentsDetailed();

      // Adiciona links HATEOAS
      return appointments.map((app) => ({
        ...app,
        links: {
          update: `${baseUrl}${API_PREFIX}/appointments/update/${app.id}`,
          delete: `${baseUrl}${API_PREFIX}/appointments/delete/${app.id}`,
        },
      }));
    } catch (error) {
      console.error("[Service] Erro em listAllAppointments:", error.message);
      throw new Error(`Erro ao listar consultas: ${error.message}`);
    }
  }

  /**
   * [V50] Lógica de Negócios: Atualiza um agendamento existente.
   */
  async updateAppointment(appointmentId, userData) {
    try {
      // 1. Desestrutura e Valida dados de entrada
      const { dateOfWeek, dayOfWeek, startTime, endTime, status, descricao } = userData;
      if (!dayOfWeek || !startTime || !endTime || !status) {
          throw new Error("Data (dayOfWeek), startTime, endTime e status são obrigatórios para atualização.");
      }

      // 2. Orquestração: Busca dados existentes
      const existingAppointment = await AppointmentsRepository.findById(appointmentId);
      if (!existingAppointment) {
        throw new Error("Agendamento não encontrado.");
      }
      
      const { doctorId, scheduleId } = existingAppointment;
      const newDate = dayOfWeek; // 'dayOfWeek' é a nova data

      // 3. Lógica de Negócios: Verificação de Conflito
      // (Exclui o próprio agendamento da checagem)
      await this.checkConflict({
        doctorId,
        date: newDate,
        newStartTime: startTime,
        newEndTime: endTime,
        appointmentIdToExclude: appointmentId,
      });

      // 4. Lógica de Negócios (Side-effect): Atualiza a VAGA
      try {
        await AppointmentsRepository.updateSchedule(scheduleId, { 
          dateOfWeek: dateOfWeek, // Lógica V3
          dayOfWeek: newDate 
        });
      } catch (updateError) {
         console.warn(`[Service] FALHA (não fatal) ao atualizar Schedule ${scheduleId} durante atualização de consulta: ${updateError.message}`);
      }

      // 5. Preparação do DTO para o Repositório
      const updateDTO = {
        date: newDate,
        startTime,
        endTime,
        status,
        descricao
      };

      // 6. Chamada ao Repositório
      return await AppointmentsRepository.update(appointmentId, updateDTO);

    } catch (error) {
      console.error("[Service] Erro em updateAppointment:", error.message);
      throw new Error(`Erro ao atualizar consulta: ${error.message}`);
    }
  }
}

// Exporta como um singleton (mantendo a arquitetura V30)
export default new AppointmentsService();