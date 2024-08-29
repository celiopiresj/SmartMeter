import { connection } from "../database/database";
import { SmartMeterModel } from "../models/SmartMeterModel";

class SmartMeterController {
	private smartMeterModel: SmartMeterModel;
	constructor() {
		this.smartMeterModel = SmartMeterModel();
	}
}
