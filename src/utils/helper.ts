import { SubBuilding } from "../models/sub-building";
import { IRoom, Room } from "../models/room";
import { ObjectId } from "mongoose";
import { Level } from "../models/level";
import { BuildingCalculation } from "../models/building-calculation";
import { NotFoundError } from "../exceptions/notFoundError";
import { IBuildingCalculation } from "../models/building-calculation";

export const ventilationCalculation = async (
    location_id: ObjectId,
    building_id: ObjectId,
    sub_building_id: ObjectId,
    level_id: ObjectId,
    room_id: ObjectId,
    action_id: ObjectId,
    area: number,
    height: number
) => {
    let roomDetails: IRoom[] = []

    if (room_id) {
        const room = await Room.findById({ room_id })
        // console.log('Printing Single Room Details : ', roomDetails)
        if (!room) {
            throw new NotFoundError(`Room with ID ${room_id} not found`);
        }

        // get data from the buildingCalculation collection for getting area, height, air_changes_per_hour and number_of_fans value
        const buildingCalculation = await BuildingCalculation.findOne({ location_id, building_id, action_id });
        if (!buildingCalculation) {
            throw new NotFoundError(`Building Calculation with ID ${building_id} not found`);
        }

        const calculationData = getVentilationDefaultData(buildingCalculation, room)

        area = area && calculationData.area
        height = height && calculationData.height

        return ventilationLogic(room as IRoom, area, height, calculationData.air_changes_per_hour, calculationData.number_of_fans,)
    }

    if (level_id) {
        roomDetails = await Room.find({ level_id })
        // console.log('Printing Room Details Level Wise : ', roomDetails)
    }

    if (sub_building_id) {
        const levels = await Level.find({ sub_building_id });
        const levelIds = levels.map(level => level._id);
        roomDetails = await Room.find({ level_id: { $in: levelIds } })
        // console.log('Printing Room Details Sub Building Wise : ', roomDetails)
    }

    if (building_id) {
        const subBuildings = await SubBuilding.find({ building_id });
        const subBuildingIds = subBuildings.map(subBuilding => subBuilding._id);
        const levels = await Level.find({ sub_building_id: { $in: subBuildingIds } });
        const levelIds = levels.map(level => level._id);
        roomDetails = await Room.find({ level_id: { $in: levelIds } })
        // console.log('Printing Room Details Building Wise : ', roomDetails)
    }

    if (!roomDetails?.length) {
        throw new NotFoundError(`No Calculation found for given parameters`);
    }

    const calculationResult: any = []

    // get data from the buildingCalculation collection for getting area, height, air_changes_per_hour and number_of_fans value
    const buildingCalculation = await BuildingCalculation.findOne({
        location_id, building_id, action_id
    });

    if (!buildingCalculation) {
        throw new NotFoundError(`Building Calculation with ID ${building_id} not found`);
    }

    roomDetails.forEach((room: IRoom) => {
        const calculationData = getVentilationDefaultData(buildingCalculation, room)
        if (calculationData.area && calculationData.height && calculationData.air_changes_per_hour && calculationData.number_of_fans) {
            const result = ventilationLogic(
                room as IRoom,
                calculationData.area,
                calculationData.height,
                calculationData.air_changes_per_hour,
                calculationData.number_of_fans
            )
            calculationResult.push(result)
        }
    });

    return calculationResult
}

const getVentilationDefaultData = (buildingCalculation: IBuildingCalculation, room: IRoom) => {
    const areaData = buildingCalculation?.action_data.get('area');
    const area = areaData[room?.name.replace(" ", "_").toLowerCase()]

    const heightData = buildingCalculation?.action_data.get('height');
    const height = heightData[room?.name.replace(" ", "_").toLowerCase()]

    const airChangesPerHourData = buildingCalculation?.action_data.get('air_changes_per_hour');
    const air_changes_per_hour = airChangesPerHourData[room?.name.replace(" ", "_").toLowerCase()]

    const numberOfFans = buildingCalculation?.action_data.get('number_of_fans');
    const number_of_fans = numberOfFans[room?.name.replace(" ", "_").toLowerCase()]

    return {
        area: parseInt(area),
        height: parseInt(height),
        air_changes_per_hour: parseInt(air_changes_per_hour),
        number_of_fans: parseInt(number_of_fans)
    }
}

const ventilationLogic = (room: IRoom, area: number, height: number, air_changes_per_hour: number, number_of_fans: number) => {
    const volume = area * height;
    const airChanges = air_changes_per_hour || 0;
    const flowRateQ_m3s = (volume * airChanges) / 3600;
    const flowRateQ_m3h = flowRateQ_m3s * 3600;
    const numberOfFans = number_of_fans || 1;
    const flowRatePerFan_m3h = flowRateQ_m3h / numberOfFans;
    const flowRatePerFan_ls = flowRatePerFan_m3h / 3.6;

    return {
        Room: room.name,
        Area: area,
        Height: height,
        Volume: volume,
        AirChanges: airChanges,
        FlowRateQ_m3s: flowRateQ_m3s,
        FlowRateQ_m3h: flowRateQ_m3h,
        NumberOfFans: numberOfFans,
        FlowRatePerFan_m3h: flowRatePerFan_m3h,
        FlowRatePerFan_ls: flowRatePerFan_ls
    }
}