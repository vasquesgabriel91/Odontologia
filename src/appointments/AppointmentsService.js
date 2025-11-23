import AppointmentsRepository from "./AppointmentsRepository.js";
import UserRepository from "../user/UserRepository.js";
import convertTimeForNumber from "../helpers/convertTimeForNumber.js";
const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class AppointmentsService {
  async checkConflict({
    doctorId,
    date,
    newStartTime,
    newEndTime,
    appointmentIdToExclude = null,
  }) {
    const existingAppointments =
      await AppointmentsRepository.findAppointmentsByDoctorAndDate({
        doctorId,
        date,
        appointmentIdToExclude,
      });

    for (const app of existingAppointments) {
      if (newStartTime < app.endTime && newEndTime > app.startTime) {
        throw new Error(
          `Horário indisponível (${newStartTime}-${newEndTime}). Já existe uma consulta agendada das ${app.startTime} às ${app.endTime}.`
        );
      }
    }
  }

  async convertTime(startTime, endTime) {
    const hoursToWork = convertTimeForNumber(startTime, endTime);
    return hoursToWork;
  }
  async appointmentDuration(appointments) {
    const durationTimes = appointments.map((app) => {
      const duration = convertTimeForNumber(app.startTime, app.endTime);
      return {
        id: app.id,
        startTime: app.startTime,
        endTime: app.endTime,
        duration,
      };
    });
    return durationTimes;
  }
  async getMiddleHoursNumber(startTime, endTime) {
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);

    const result = [];
    for (let h = start + 1; h < end; h++) {
      result.push(h);
    }
    return result;
  }

  async listSchedules() {
    try {
      const appointments = await AppointmentsRepository.getAllAppointments();

      const schedulesData = appointments.map((app) => ({
        scheduleId: app.schedule.id,
        scheduleStartTime: app.schedule.startTime,
        scheduleEndTime: app.schedule.endTime,
        appointmentStartTime: app.startTime,
        appointmentEndTime: app.endTime,
      }));

      const hoursBySchedule = {};

      schedulesData.forEach((app) => {
        const {
          scheduleId,
          scheduleStartTime,
          scheduleEndTime,
          appointmentStartTime,
          appointmentEndTime,
        } = app;

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

        const hoursToWorkByDoctor =
          hoursBySchedule[scheduleId].hoursToWorkByDoctor;

        hoursBySchedule[scheduleId].totalHours += hoursToWorkByPatient;
      });

      const schedulesComplete = [];

      for (const [scheduleId, data] of Object.entries(hoursBySchedule)) {
        const { totalHours, hoursToWorkByDoctor } = data;

        if (totalHours >= hoursToWorkByDoctor) {
          schedulesComplete.push(scheduleId);
        }
      }

      const getSchedulesAvailable =
        await AppointmentsRepository.getSchedulesAvailable(schedulesComplete);

      const output = getSchedulesAvailable.map((user) => ({
        ...user.dataValues,
        links: {
          create: `${baseUrl}${API_PREFIX}/appointments/${user.id}`,
        },
      }));

      return output;
    } catch (error) {
      throw new Error("Erro ao listar os usuários: " + error.message);
    }
  }
  async getByNameOrEmail(email) {
    try {
      const getByEmail = await UserRepository.findByUserNameOrEmail(email);
      if (!getByEmail) {
        throw new Error("Usuário não encontrado.");
      }
      return getByEmail;
    } catch (error) {
      throw new Error("Erro ao buscar usuário: " + error.message);
    }
  }
  async getAppointmentByPatientIdAndScheduleId(patientId, scheduleId) {
    try {
      const appointment =
        await AppointmentsRepository.getAppointmentByPatientIdAndScheduleId(
          patientId,
          scheduleId
        );
      if (appointment > 0) {
        throw new Error("Usuário já possui agendamento para esta agenda.");
      }
      return appointment;
    } catch (error) {
      throw new Error("Erro ao buscar consulta: " + error.message);
    }
  }
  async getHourDoctorSchedule(scheduleId) {
    const availableSchedule =
      await AppointmentsRepository.CheckTheAvailableTimes(scheduleId);
    const endTime = availableSchedule.endTime;
    const startTime = availableSchedule.startTime;

    const convertedHours = await this.convertTime(startTime, endTime);

    return convertedHours;
  }
  async checkAvailableStartTime(
    scheduleId,
    appointmentStartTime,
    appointmentEndTime
  ) {
    const checkAvailable =
      await AppointmentsRepository.getAvailableScheduleByIdAndStartTime(
        scheduleId,
        appointmentStartTime
      );
    const durationTimeAppointments = await this.appointmentDuration(
      checkAvailable
    );
    const overlappingAppointments = durationTimeAppointments.filter(
      (app) => app.duration > 1
    );
  const allMiddleHours = [];

    for (const app of overlappingAppointments) {
      const appointmentId = await AppointmentsRepository.getAppointmentById(app.id);
      const startTime = appointmentId.startTime;
      const endTime = appointmentId.endTime;
         const middleHours = await this.getMiddleHoursNumber(startTime, endTime);

    allMiddleHours.push(...middleHours);
    }

    console.log("All Middle Hours:", allMiddleHours);

    if (checkAvailable.length > 0) {
      throw new Error(
        `Horários indisponíveis: ${JSON.stringify(checkAvailable)}`
      );
    }
    return checkAvailable;
  }

  async availableAppointmentSlots(scheduleId, convertedHourDoctorSchedule) {
    let totalHours = 0;
    try {
      const appointment =
        await AppointmentsRepository.getAppointmentByScheduleId(scheduleId);
      appointment.forEach((app) => {
        const appointmentHours = convertTimeForNumber(
          app.startTime,
          app.endTime
        );
        totalHours += appointmentHours;

        if (totalHours >= convertedHourDoctorSchedule) {
          throw new Error("Não há horários disponíveis para agendamento.");
        }
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createAppointments(scheduleId, secretaryId, appointmentData) {
    try {
      const { email, startTime, endTime, status, descricao } = appointmentData;

      const getByEmail = await this.getByNameOrEmail(email);

      const ExistAppointmentByUserId =
        await this.getAppointmentByPatientIdAndScheduleId(
          getByEmail.id,
          scheduleId
        );

      const convertedHourDoctorSchedule = await this.getHourDoctorSchedule(
        scheduleId
      );
      const checkAvailable = await this.checkAvailableStartTime(
        scheduleId,
        startTime,
        endTime
      );

      const checkUserHaveAppointment = await this.availableAppointmentSlots(
        scheduleId,
        convertedHourDoctorSchedule
      );

      const patientId = getByEmail.id;

      const getScheduleById = await AppointmentsRepository.getScheduleById(
        scheduleId
      );

      const doctorId = getScheduleById.doctorId;

      const date = getScheduleById.dayOfWeek;

      const scheduleStartTime = getScheduleById.startTime;

      const scheduleEndTime = getScheduleById.endTime;

      if (startTime < scheduleStartTime || endTime > scheduleEndTime) {
        throw new Error(
          `Consulta fora do horário da agenda. Disponível: ${scheduleStartTime} - ${scheduleEndTime}`
        );
      }

      const createAppointments =
        await AppointmentsRepository.createAppointments(
          startTime,
          endTime,
          status,
          descricao,
          scheduleId,
          patientId,
          doctorId,
          secretaryId,
          date
        );
      return createAppointments;
    } catch (error) {
      throw new Error("Erro ao criar consulta: " + error.message);
    }
  }
  async listAllAppointments() {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const dateFormate = `${year}-${month}-${day}`;
      const appointments =
        await AppointmentsRepository.getAllAppointmentsDetailed();

      const output = appointments.map((app) => ({
        ...app,
        links: {
          update: `${baseUrl}${API_PREFIX}/appointments/update/${app.id}`,
          delete: `${baseUrl}${API_PREFIX}/appointments/delete/${app.id}`,
        },
      }));

      return output;
    } catch (error) {
      throw new Error("Erro ao listar consultas: " + error.message);
    }
  }
  async updateAppointment(appointmentId, userData) {
    const { dateOfWeek, dayOfWeek, startTime, endTime, status } = userData;
    try {
      const getAppointmentById =
        await AppointmentsRepository.getAppointmentById(appointmentId);
      const scheduleId = getAppointmentById.scheduleId;

      const updateDateOfWeek = await AppointmentsRepository.updateDateOfWeek(
        scheduleId,
        dateOfWeek,
        dayOfWeek
      );

      const updateAppointment = await AppointmentsRepository.updateAppointment(
        appointmentId,
        dayOfWeek,
        startTime,
        endTime,
        status
      );
      return updateAppointment;
    } catch (error) {
      throw new Error("Erro ao atualizar consulta: " + error.message);
    }
  }
}
export default new AppointmentsService();
