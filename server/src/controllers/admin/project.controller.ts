import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import { ImageDeleteUtil } from "../../helpers/cloudinary";
import Project from "../../models/project";
import { IProject } from "../../types/types";
import {
	projectSchema,
	updateProjectSchema,
} from "../../validations/projectValidation";

// add a new Project
const addProject: RequestHandler = async (req: Request, res: Response) => {
	try {
		const { success, data, error } = projectSchema.safeParse(req.body);

		if (!success || error) {
			res.status(400).json({ success, message: error.flatten().fieldErrors });
			return;
		}

		const newProject = await Project.create(data);

		if (!newProject) {
			res
				.send(400)
				.json({ success: false, message: "Failed to create project" });
			return;
		}

		res.status(200).json({
			success: true,
			message: "Projects created successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong" });
	}
};

// get all Projects
const getProjects: RequestHandler = async (req: Request, res: Response) => {
	try {
		const projects = await Project.find()
			.sort({ order: 1 })
			.select("-image.public_id");
		res
			.status(200)
			.json({ success: true, message: "Projects fetched", projects });
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong" });
	}
};

// update Project
const updateProject: RequestHandler = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			res
				.status(400)
				.json({ success: false, message: "Invalid or incorrect ID format." });
			return;
		}

		const { data, success, error } = updateProjectSchema.safeParse(req.body);

		if (!success || error) {
			res.status(400).json({ success, message: error.flatten().fieldErrors });
			return;
		}

		const project: IProject | null = await Project.findById(id);

		if (!project) {
			res.status(404).json({ success: false, message: "Project not found" });
			return;
		}

		if (data.image?.url && data.image.public_id) {
			await ImageDeleteUtil(project.image.public_id);
		}

		project.image = data.image || project.image;
		project.title = data.title || project.title;
		project.description = data.description || project.description;
		project.fullDescription = data.fullDescription || project.fullDescription;
		project.tools = data.tools || project.tools;
		project.github_link = data.github_link || project.github_link;
		project.live_link = data.live_link || project.live_link;
		project.yt_link = data.yt_link || project.yt_link;

		await project.save();

		res
			.status(200)
			.json({ success: true, message: "Project updated successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong" });
	}
};

// delete Project
const deleteProject: RequestHandler = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			res
				.status(400)
				.json({ success: false, message: "Invalid or missing project ID" });
			return;
		}

		const project: IProject | null = await Project.findById(id);

		if (!project) {
			res.status(404).json({ success: false, message: "Project not found" });
			return;
		}

		await ImageDeleteUtil(project.image.public_id);
		await Project.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message: "Projects deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong" });
	}
};

// TODO: Implement reorderProjects handler logic

// reorder Projects
const reorderProjects: RequestHandler = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ success: true, message: "Projects fetched" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong" });
	}
};

export {
	addProject,
	deleteProject,
	getProjects,
	reorderProjects,
	updateProject,
};
