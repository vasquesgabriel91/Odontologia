import ObservationUseCase from "./ObservationUseCase.js";

class ObservationController {
 async createObservationAppointment(req, res) {
    const observationData = req.body;
    const  idParams  = req.params.id;

    if (req.file) {
      observationData.exams = req.file.path;
    }

    try {
      const observation = await ObservationUseCase.addObservationAppointment(observationData, idParams);
      res.status(201).json({ message: observation });
    } catch (error) {
      res.status(400).json({ error: error.message });
    } 
  }
}

export default new ObservationController(); 