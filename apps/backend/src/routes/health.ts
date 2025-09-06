import { Router } from "express";

const router: Router = Router();

router.get("", (_, res) => {
	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

export default router;
