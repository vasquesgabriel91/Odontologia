/*
 * ========================================================================
 * ARQUIVO: src/appointments/AppointmentsRepository.js (V50)
 * RESPONSABILIDADE: Camada de Acesso a Dados (Data Access Layer).
 * Apenas executa consultas de banco de dados (Sequelize).
 * Não contém NENHUMA lógica de negócios.
 * ========================================================================
 */

import AppointmentModel from "./AppointmentsModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";
import User from "../user/UserModel.js";
import { Op } from "sequelize";

class AppointmentsRepository {
  
  /**
   * [V50] Cria um novo agendamento no banco.
   * Aceita um único objeto de dados (DTO).
   */
  async create(appointmentData) {
    try {
      return await AppointmentModel.create(appointmentData);
    } catch (error) {
      // O 'error.message' aqui é o "notNull Violation"
      console.error("[Repository] Erro ao criar Appointment:", error.message);
      // Propaga o erro para o Service tratar
      throw new Error(`Erro de banco de dados ao criar agendamento: ${error.message}`);
    }
  }

  /**
   * [V50] Atualiza um agendamento existente por ID.
   * Aceita um ID e um objeto de dados (DTO) com os campos a serem atualizados.
   */
  async update(appointmentId, dataToUpdate) {
    try {
      const [affectedRows] = await AppointmentModel.update(dataToUpdate, {
        where: { id: appointmentId },
      });

      if (affectedRows === 0) {
        throw new Error("Agendamento não encontrado para atualização.");
      }
      
      // Retorna o registro atualizado
      return await this.findById(appointmentId);

    } catch (error) {
      console.error("[Repository] Erro ao atualizar Appointment:", error.message);
      throw new Error(`Erro de banco de dados ao atualizar agendamento: ${error.message}`);
    }
  }

  /**
   * [V50] Busca um agendamento por sua Chave Primária (ID).
   */
  async findById(id) {
    return await AppointmentModel.findByPk(id);
  }

  /**
   * [V50] Busca uma VAGA (Schedule) por sua Chave Primária (ID).
   * PhD Note: Esta função deveria estar em um 'SchedulesRepository.js'
   * para seguir 100% o SRP, mas a mantemos aqui para compatibilidade
   * com sua arquitetura existente.
   */
  async findScheduleById(id) {
    const schedule = await SchedulesModel.findByPk(id);
    if (!schedule) {
      throw new Error("Vaga (schedule) não encontrada.");
    }
    return schedule;
  }

  /**
   * [V50] Atualiza uma VAGA (Schedule) no banco.
   * PhD Note: Também deveria estar em 'SchedulesRepository.js'.
   */
  async updateSchedule(scheduleId, dataToUpdate) {
    try {
        await SchedulesModel.update(dataToUpdate, { 
            where: { id: scheduleId } 
        });
    } catch (error) {
        console.error("[Repository] Erro ao atualizar Schedule:", error.message);
        throw new Error(`Erro de banco de dados ao atualizar vaga: ${error.message}`);
    }
  }

  /**
   * [V50] Busca todos os agendamentos de um médico em uma data específica
   * para verificação de conflito.
   */
  async findAppointmentsByDoctorAndDate({ doctorId, date, appointmentIdToExclude = null }) {
    const whereClause = {
      doctorId: doctorId,
      date: date,
      status: { [Op.in]: ['agendado'] },
    };

    if (appointmentIdToExclude) {
      whereClause.id = { [Op.not]: appointmentIdToExclude };
    }

    return await AppointmentModel.findAll({
      where: whereClause,
      attributes: ['startTime', 'endTime'],
      raw: true, // Retorna JSON puro
    });
  }

  /**
   * [V50] Busca todas as VAGAS disponíveis (Schedules) que ainda não
   * estão 100% preenchidas e são a partir de hoje.
   * (Esta é a V20.1 com o 'include' de appointments ativado)
   */
  async getSchedulesAvailable(schedulesCompleteIds = []) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const dateFormate = `${year}-${month}-${day}`;

    return await SchedulesModel.findAll({
      include: [
        {
          model: AppointmentModel,
          as: "appointments",
          required: false,
          attributes: ["startTime", "endTime", "status"],
          where: {
            status: { [Op.in]: ["agendado"] },
          },
        },
        {
          model: User,
          as: "doctor",
          attributes: ["id", "username"],
        },
      ],
      where: {
        id: { [Op.notIn]: schedulesCompleteIds },
        dayOfWeek: { [Op.gte]: dateFormate },
      },
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC']
      ]
    });
  }

  /**
   * [V50] Busca a lista detalhada de TODOS os agendamentos para
   * a tela principal da secretária.
   */
  async getAllAppointmentsDetailed() {
    const appointments = await AppointmentModel.findAll({
      include: [
        { 
          model: User, 
          as: "patient", 
          attributes: { exclude: ["password"] } 
        },
        { 
          model: User, 
          as: "doctor", 
          attributes: ["id", "username"] 
        },
        { 
          model: SchedulesModel, 
          as: "schedule", 
          required: false, // LEFT JOIN
          attributes: [], 
        },
      ],
      order: [ 
        ['date', 'DESC'], 
        ['startTime', 'ASC'] 
      ]
    });

    // Filtro de integridade: remove agendamentos sem paciente ou médico (ex: órfãos)
    return appointments
      .filter(app => app.patient && app.doctor)
      .map((app) => app.toJSON());
  }

  /**
   * [V50] Função antiga de 'getAllAppointments' que parecia ser usada
   * pelo 'listSchedules' para calcular horas.
   */
   async getAllAppointmentsForScheduleCalc() {
    return await AppointmentModel.findAll({
      attributes: ["id", "startTime", "endTime"],
      include: [{ 
        model: SchedulesModel, 
        as: "schedule", 
        attributes: ["id", "startTime", "endTime"] 
      }],
      raw: true, // Retorna JSON puro
    });
  }

}

// Exporta como um singleton (mantendo a arquitetura V30)
export default new AppointmentsRepository();