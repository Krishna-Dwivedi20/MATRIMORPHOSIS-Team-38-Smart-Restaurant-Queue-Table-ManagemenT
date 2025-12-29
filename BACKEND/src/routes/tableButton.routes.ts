import { Router } from 'express';
import tableButtonController from '../controllers/tableButton.controller';

const router = Router();

router.use('/buttons', tableButtonController);

export default router;
