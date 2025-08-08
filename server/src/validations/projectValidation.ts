import zod from "zod";

const tagSchema = zod.object({
	id: zod.string().optional(),
	text: zod.string().min(1, "Tool name is required"),
});

const projectSchema = zod.object({
	title: zod.string().min(1, "Name is required"),
	image: zod.object({
		url: zod.string().url().min(1, "Image url is required"),
		public_id: zod.string(),
	}),
	description: zod
		.string()
		.min(1, "description is required"),
	fullDescription: zod
		.string()
		.min(1, "description is required"),
	github_link: zod
		.string()
		.optional()
		.default("https://github.com/Yashh1524"),
	live_link: zod.string().optional(),
	yt_link: zod.string().optional(),
	tools: zod.array(tagSchema).nonempty("At least one tool is required"),
	order: zod.number().optional().default(0),
});

const updateProjectSchema = projectSchema.partial().extend({
	image: projectSchema.shape.image.optional(),
});

export { projectSchema, updateProjectSchema };
