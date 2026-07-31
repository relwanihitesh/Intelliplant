const departmentmodel = require('../models/department.model');
const logger = require('../config/logger');

const { departmentSchema } = require('../validations/departmentValidation');

const createDepartment = async (req, res) => {
    const validation = departmentSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: validation.error.issues.map(e => e.message)
        });
    }

    const { name, description } = validation.data;

    try {
        const isDepartmentAlreadyExsist = await departmentmodel.findOne({ name });
        if (isDepartmentAlreadyExsist) {
            return res.status(400).json({ message: "department already exists" });
        }
        const newDepartment = await departmentmodel.create({ name, description });
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(500).json({ message: "error creating department", error });
    }
};

const updateDepartment = async (req, res) => {
    const { id } = req.params;

    const validation = departmentSchema.partial().safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: validation.error.issues.map(e => e.message)
        });
    }

    const { name, description } = validation.data;

    try {
        const updatedDepartment = await departmentmodel.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedDepartment) {
            return res.status(404).json({ message: "department not found" });
        }

        res.status(200).json({ message: "department updated successfully", updatedDepartment });
    } catch (error) {
        logger.error(`Error updating department: ${error.message}`);
        res.status(500).json({ message: "error updating department", error });
    }
};

const getAllDepartments = async (req, res) => {

    try {

        const departments = await departmentmodel.find();
        res.status(200).json(departments);
    
    }
    catch (error) {
        res.status(500).json({ message: "error fetching departments", error });
    }
}

const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDepartment = await departmentmodel.findByIdAndDelete(id);

        if (!deletedDepartment) {
            return res.status(404).json({ message: "department not found" });
        }

        res.status(200).json({ message: "department deleted successfully", deletedDepartment });
    } catch (error) {
        logger.error(`Error deleting department: ${error.message}`);
        res.status(500).json({ message: "error deleting department", error });
    }
};

module.exports = { createDepartment, getAllDepartments , updateDepartment, deleteDepartment };