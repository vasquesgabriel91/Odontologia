function validateFields(validateFields) {
  return (req, res, next) => {
    const missingFields = validateFields.filter((field) => !req.body[field]);
    
    if (missingFields.length) {
      return res
        .status(400)
        .json({ error: `Campos faltando: ${missingFields.join(", ")}` });
    }
    next();
  };
}

export default validateFields;
