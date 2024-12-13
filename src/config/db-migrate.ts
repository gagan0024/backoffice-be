import { Location, ILocation } from '../models/location';
import { Building } from '../models/building';
import { SubBuilding } from '../models/sub-building';
import { Level } from '../models/level';
import { Service } from '../models/service';
import { SubService } from '../models/sub-service';
import { Types } from 'mongoose';
import { Room } from '../models/room';

const migrate = async (): Promise<any> => {
    await migrateLocations();
    await migrateBuildingAndSubBuildings()
    await migrateServiceAndSubServices()
}

const migrateLocations = async () => {
    const locations = [
        { name: 'Delhi', image: 'delhi.jpg' } as ILocation,
        { name: 'Noida', image: 'noida.jpg' } as ILocation,
        { name: 'Agra', image: 'agra.jpg' } as ILocation,
        { name: 'Lucknow', image: 'lucknow.jpg' } as ILocation,
        { name: 'Jaipur', image: 'jaipur.jpg' } as ILocation,
        { name: 'Bhopal', image: 'bhopal.jpg' } as ILocation,
        { name: 'Indore', image: 'indore.jpg' } as ILocation,
        { name: 'Mumbai', image: 'mumbai.jpg' } as ILocation,
        { name: 'Nagpure', image: 'nagpure.jpg' } as ILocation,
        { name: 'Pune', image: 'pune.jpg' } as ILocation,
        { name: 'Bangalore', image: 'bangalore.jpg' } as ILocation,
        { name: 'Chennai', image: 'chennai.jpg' } as ILocation,
        { name: 'Cochi', image: 'cochi.jpg' } as ILocation,
        { name: 'Hyderabad', image: 'hyderabad.jpg' } as ILocation,
        { name: 'Patna', image: 'patna.jpg' } as ILocation,
        { name: 'Ahmedabad', image: 'ahmedabad.jpg' } as ILocation,
        { name: 'Surat', image: 'surat.jpg' } as ILocation,
        { name: 'Kolkatta', image: 'kolkatta.jpg' } as ILocation,
    ]
    try {
        const bulkOps = locations.map((location) => ({
            updateOne: {
                filter: { name: location.name },
                update: { $set: location },
                upsert: true,
            },
        }));
        const result = await Location.bulkWrite(bulkOps);
        console.log("Location Upsert Result:", result.isOk());
    } catch (error) {
        console.log(error)
    }
}

const migrateBuildingAndSubBuildings = async () => {
    const buildingsData = [
        {
            type: "Elevated Metro Station",
            description: "Elevated Metro Station",
            image: "",
            subBuildings: [
                {
                    type: "Station Building",
                    description: "Primary building for passenger services in elevated metro stations.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Entry/exit points, ticket counters, and basic amenities.",
                            rooms: [
                                {
                                    name: "STATION ENTRY-01",
                                    description: "STATION ENTRY-01"
                                },
                                {
                                    name: "STATION ENTRY-02",
                                    description: "STATION ENTRY-02"
                                },
                                {
                                    name: "SPARE ROOM",
                                    description: "SPARE ROOM"
                                }
                            ]
                        },
                        {
                            name: "Concourse",
                            description: "Passenger waiting areas, ticket validation, and shops.",
                            rooms: [
                                {
                                    name: "SCR ROOM",
                                    description: "SCR ROOM"
                                },
                                {
                                    name: "TOM ROOM",
                                    description: "TOM ROOM"
                                },
                                {
                                    name: "TELECOM EQUIPMENT ROOM",
                                    description: "TELECOM EQUIPMENT ROOM"
                                },
                                {
                                    name: "UPS ROOM",
                                    description: "UPS ROOM"
                                },
                                {
                                    name: "SINGNLING EQUIPMENT ROOM",
                                    description: "SINGNLING EQUIPMENT ROOM"
                                },
                                {
                                    name: "ASS ROOM",
                                    description: "ASS ROOM"
                                },
                                {
                                    name: "ODU ROOM/SPACE",
                                    description: "ODU ROOM/SPACE"
                                },
                                {
                                    name: "LOADING/UNLOADING DECK",
                                    description: "LOADING/UNLOADING DECK"
                                },
                                {
                                    name: "BOH CORRIDOR",
                                    description: "BOH CORRIDOR"
                                },
                                {
                                    name: "ESC PANEL SPACE",
                                    description: "ESC PANEL SPACE"
                                },
                                {
                                    name: "MALE TOILET AREA",
                                    description: "MALE TOILET AREA"
                                },
                                {
                                    name: "FEMALE TOILET AREA",
                                    description: "FEMALE TOILET AREA"
                                },
                                {
                                    name: "ACCESSIBLE TOILET AREA",
                                    description: "ACCESSIBLE TOILET AREA"
                                },
                                {
                                    name: "F. CHANGING ROOM",
                                    description: "F. CHANGING ROOM"
                                },
                                {
                                    name: "M. CHANGING ROOM",
                                    description: "M. CHANGING ROOM"
                                },
                                {
                                    name: "MESS ROOM",
                                    description: "MESS ROOM"
                                },
                                {
                                    name: "SPARE ROOM",
                                    description: "SPARE ROOM"
                                },
                                {
                                    name: "SECURITY ROOM",
                                    description: "SECURITY ROOM"
                                },
                                {
                                    name: "PAID AREA",
                                    description: "PAID AREA"
                                },
                                {
                                    name: "UNPAID AREA",
                                    description: "UNPAID AREA"
                                },
                                {
                                    name: "ENTRY EXIT CORRIDOR",
                                    description: "ENTRY EXIT CORRIDOR"
                                }
                            ]
                        },
                        {
                            name: "Platform",
                            description: "Boarding and alighting of trains with safety measures.",
                            rooms: [
                                {
                                    name: "PLATFORM AREA-01",
                                    description: "PLATFORM AREA-01"
                                },
                                {
                                    name: "PLATFORM AREA-02",
                                    description: "PLATFORM AREA-02"
                                }
                            ]
                        },
                        {
                            name: "Roof",
                            description: "Covers and protects the platform; may include solar panels."
                        }
                    ]
                },
                {
                    type: "Pump Room",
                    description: "Facility housing water and power management systems.",
                    levels: [
                        {
                            name: "DG Room",
                            description: "Room for the diesel generator providing backup power."
                        },
                        {
                            name: "Pump Room",
                            description: "Manages water pumping systems for station operations."
                        }
                    ]
                },
                {
                    type: "Parking Areas",
                    description: "Designated parking spaces for commuters.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Open or covered parking for two-wheelers and four-wheelers."
                        },
                        {
                            name: "First Floor",
                            description: "Additional parking space with ramps or lifts for vehicles."
                        }
                    ]
                }
            ]
        },
        {
            type: "Underground Metro Station",
            description: "Underground Metro Station",
            image: "",
            subBuildings: [
                {
                    type: "Station Building",
                    description: "Main structure for passenger services in underground metro stations.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Surface-level facilities, entry/exit to the station."
                        },
                        {
                            name: "Concourse",
                            description: "Ticketing, passenger movement, and shops."
                        },
                        {
                            name: "Platform",
                            description: "Subterranean boarding/alighting of trains with safety features."
                        },
                        {
                            name: "Undercroft",
                            description: "Storage, service areas, and technical installations."
                        }
                    ]
                },
                {
                    type: "Ancillary Building",
                    description: "Support structure for operational and technical systems.",
                    levels: [
                        {
                            name: "DG Room",
                            description: "Diesel generator for emergency power."
                        },
                        {
                            name: "Pump Room",
                            description: "Water management systems."
                        },
                        {
                            name: "Water Tank",
                            description: "Storage for firefighting or operational water needs."
                        },
                        {
                            name: "First Floor",
                            description: "Administrative or technical rooms."
                        },
                        {
                            name: "Cooling Tower",
                            description: "Manages HVAC systems to regulate temperature."
                        }
                    ]
                },
                {
                    type: "Utility Gallery",
                    description: "Space for utilities like electrical, telecom, or drainage systems.",
                    levels: [
                        {
                            name: "Ground Floor Tower",
                            description: "Area for utility installations and access."
                        }
                    ]
                }
            ]
        },
        {
            type: "Depot",
            description: "Depot",
            image: "",
            subBuildings: [
                {
                    type: "Admin Building",
                    description: "Administrative hub for depot operations.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Reception, offices, and security."
                        },
                        {
                            name: "First Floor",
                            description: "Administrative offices and meeting rooms."
                        },
                        {
                            name: "Second Floor",
                            description: "Additional offices or technical staff areas."
                        },
                        {
                            name: "Third Floor",
                            description: "Higher management offices or operations rooms."
                        },
                        {
                            name: "Terrace",
                            description: "Open space for HVAC units or other utilities."
                        }
                    ]
                },
                {
                    type: "Workshop Building",
                    description: "Building for train maintenance and repairs.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Maintenance and repair workshops."
                        },
                        {
                            name: "First Floor",
                            description: "Offices or tool storage related to maintenance."
                        }
                    ]
                },
                {
                    type: "Pump Room",
                    description: "Facility managing water systems for the depot.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Pump operations."
                        },
                        {
                            name: "Water Tank",
                            description: "Water storage for operations or fire safety."
                        }
                    ]
                },
                {
                    type: "ASS Room",
                    description: "Auxiliary Sub-Station for electrical supply management.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Space for electrical systems and backup equipment."
                        }
                    ]
                },
                {
                    type: "Auto Wash Plant",
                    description: "Facility for automated train washing.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Automatic train washing equipment."
                        }
                    ]
                },
                {
                    type: "Cleaning Contractor Staff Toilet",
                    description: "Restroom facilities for cleaning staff.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Toilet facilities for contractor staff."
                        }
                    ]
                },
                {
                    type: "Compressor Room",
                    description: "Houses air compressors for maintenance tasks.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Air compressors for operational needs."
                        }
                    ]
                },
                {
                    type: "Etu",
                    description: "Electric Traction Unit for train movement systems.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Manages electric traction systems for train movement."
                        }
                    ]
                },
                {
                    type: "Pit Wheel Lathe",
                    description: "Facility for train wheel maintenance.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Wheel maintenance and alignment operations."
                        }
                    ]
                },
                {
                    type: "Scrap Yard",
                    description: "Storage area for scrap materials or waste.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Designated area for storing scrap materials."
                        }
                    ]
                },
                {
                    type: "Store And S&T Cables",
                    description: "Storage for spare parts and signaling cables.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Storage space for operational supplies."
                        }
                    ]
                },
                {
                    type: "Time Office And Security Building",
                    description: "Tracks employee attendance and handles security operations.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Security and administrative functions."
                        }
                    ]
                },
                {
                    type: "Welding Plant",
                    description: "Welding operations for maintenance tasks.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Space for welding and associated equipment."
                        }
                    ]
                },
                {
                    type: "Storage",
                    description: "General storage for depot operations.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Storage area for operational supplies."
                        }
                    ]
                },
                {
                    type: "Stabling Yard",
                    description: "Parking for trains during non-operational hours.",
                    levels: [
                        {
                            name: "Ground Floor",
                            description: "Designated area for train parking."
                        }
                    ]
                }
            ]
        }
    ]

    try {
        console.log('Starting Buildings migration...');

        const clonedBuildingsData = JSON.parse(JSON.stringify(buildingsData))

        // Upsert Buildings
        const buildingOperations = clonedBuildingsData.map((building: any) => ({
            updateOne: {
                filter: { type: building.type }, // Match on the unique field (e.g., `type`)
                update: { $set: building },
                upsert: true, // Insert if not found
            },
        }));


        const buildingResult = await Building.bulkWrite(buildingOperations);
        console.log('Buildings Upsert Result:', buildingResult.isOk());

        // Fetch updated buildings to establish relationships for sub-buildings
        const updatedBuildings = await Building.find({
            type: { $in: clonedBuildingsData.map((b: any) => b.type) },
        });

        const buildingArray = updatedBuildings.reduce<{ type: string; id: Types.ObjectId }[]>((array, building) => {
            array.push({ type: building.type, id: building.id });
            return array;
        }, []);

        // Upsert SubBuildings
        const subBuildingOperations: any[] = [];
        buildingsData.forEach((building) => {
            // Find the matching building in the array
            const matchingBuilding = buildingArray.find(
                (item) => item.type === building.type
            );
            const buildingId = matchingBuilding ? matchingBuilding.id : null;
            if (!buildingId) return
            if (building.subBuildings) {
                building.subBuildings.forEach((subBuilding) => {
                    subBuildingOperations.push({
                        updateOne: {
                            filter: { type: subBuilding.type, building_id: buildingId },
                            update: { $set: { ...subBuilding, building_id: buildingId } },
                            upsert: true,
                        },
                    });
                });
            }
        });

        const subBuildingResult = await SubBuilding.bulkWrite(subBuildingOperations);
        console.log('SubBuildings Upsert Result:', subBuildingResult.isOk());

        // Fetch updated sub-buildings to establish relationships for levels
        const updatedSubBuildings = await SubBuilding.find({
            building_id: { $in: buildingArray.map((item) => item.id) },
        });

        const subBuildingArray = updatedSubBuildings.reduce<{ type: string; id: Types.ObjectId, buildingId: Types.ObjectId }[]>((array, subBuilding) => {
            array.push({ id: subBuilding.id, type: subBuilding.type, buildingId: subBuilding.building_id });
            return array;
        }, []);

        // Upsert Levels
        const levelOperations: any[] = [];
        buildingsData.forEach((building) => {
            if (building.subBuildings) {
                building.subBuildings.forEach((subBuilding) => {
                    // Find the matching subBuilding in the array
                    const subBuildingId = subBuildingArray.find((subBuildingItem) => {
                        const matchedBuildingData = updatedBuildings.find((buildingItem) => buildingItem.id === subBuildingItem.buildingId.toString())
                        return subBuildingItem.type === subBuilding.type && matchedBuildingData?.type === building.type
                    })?.id;

                    if (!subBuildingId) return
                    if (subBuilding.levels) {
                        subBuilding.levels.forEach((level) => {
                            levelOperations.push({
                                updateOne: {
                                    filter: { name: level.name, sub_building_id: subBuildingId },
                                    update: { $set: { ...level, sub_building_id: subBuildingId } },
                                    upsert: true,
                                },
                            });
                        });
                    }
                });
            }
        });

        const levelResult = await Level.bulkWrite(levelOperations);
        console.log('Levels Upsert Result:', levelResult.isOk());

        // Fetch updated levels to establish relationships for rooms
        const updatedLevels = await Level.find({
            sub_building_id: { $in: subBuildingArray.map((item) => item.id) },
        });

        const levelArray = updatedLevels.reduce<{ name: string; id: Types.ObjectId, subBuildingId: Types.ObjectId }[]>((array, level) => {
            array.push({ id: level.id, name: level.name, subBuildingId: level.sub_building_id })
            return array;
        }, []);

        // Upsert Rooms
        const roomOperations: any[] = [];
        buildingsData.forEach((building) => {
            if (building.subBuildings) {
                building.subBuildings.forEach((subBuilding) => {
                    if (subBuilding.levels) {
                        subBuilding.levels.forEach((level) => {
                            const levelId = levelArray.find((levelItem) => {
                                const matchedSubBuildingData = updatedSubBuildings.find((subBuildingItem) => subBuildingItem.id === levelItem.subBuildingId.toString())
                                return levelItem.name === level.name && matchedSubBuildingData?.type === subBuilding.type
                            })?.id;

                            if (!levelId) return
                            if (level.rooms) {
                                level.rooms.forEach((room) => {
                                    roomOperations.push({
                                        updateOne: {
                                            filter: { name: room.name, level_id: levelId },
                                            update: { $set: { ...room, level_id: levelId } },
                                            upsert: true,
                                        },
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });

        const roomResult = await Room.bulkWrite(roomOperations);
        console.log('Rooms Upsert Result:', roomResult.isOk());

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Error during migration:', error);
    }

}

const migrateServiceAndSubServices = async () => {
    try {
        // Array of services and their sub-services
        const servicesData = [
            {
                name: "Electrical",
                description: "Electrical services including lighting, power, and equipment setup.",
                image: "electrical.jpg",
                subServices: [
                    { name: "Lighting", description: "Services related to lighting systems and installations.", image: "lighting.jpg" },
                    { name: "Power", description: "Services related to power supply and distribution.", image: "power.jpg" },
                    { name: "Equipment", description: "Installation and management of electrical equipment.", image: "equipment.jpg" },
                    { name: "Containment", description: "Cable containment systems and related services.", image: "containment.jpg" },
                    { name: "Earthing", description: "Services for earthing and grounding systems.", image: "earthing.jpg" },
                    { name: "Fire Detection", description: "Fire detection systems and installations.", image: "fire_detection.jpg" }
                ]
            },
            {
                name: "HVAC",
                description: "Heating, Ventilation, and Air Conditioning services.",
                image: "hvac.jpg",
                subServices: [
                    { name: "Chilled Water System", description: "Services for chilled water systems.", image: "chilled_water.jpg" },
                    { name: "VRF / VRV", description: "Variable Refrigerant Flow and Volume systems.", image: "vrf_vrv.jpg" },
                    { name: "Direct Expansion", description: "Direct expansion HVAC systems.", image: "direct_expansion.jpg" },
                    { name: "Ventilation", description: "Ventilation systems and installations.", image: "ventilation.jpg" }
                ]
            },
            {
                name: "Fire Fighting",
                description: "Fire fighting services including hydrant and sprinkler systems.",
                image: "fire_fighting.jpg",
                subServices: [
                    { name: "Hydrant System", description: "Installation and management of hydrant systems.", image: "hydrant_system.jpg" },
                    { name: "Sprinkler System", description: "Sprinkler systems for fire safety.", image: "sprinkler_system.jpg" },
                    { name: "Fire Extinguisher", description: "Services related to fire extinguishers.", image: "fire_extinguisher.jpg" }
                ]
            },
            {
                name: "Plumbing",
                description: "Plumbing services including water supply and drainage.",
                image: "plumbing.jpg",
                subServices: [
                    { name: "Water Supply", description: "Services for water supply systems.", image: "water_supply.jpg" },
                    { name: "Drainage", description: "Drainage systems and installations.", image: "drainage.jpg" }
                ]
            }
        ];

        // Step 1: Prepare bulkWrite operations for Services
        const serviceOps = servicesData.map(service => ({
            updateOne: {
                filter: { name: service.name }, // Match by unique field (e.g., name)
                update: { $set: { ...service } },
                upsert: true // Insert if not found
            }
        }));

        // Execute Service bulkWrite
        const serviceResult = await Service.bulkWrite(serviceOps);
        console.log('Services Upsert Result:', serviceResult.isOk());

        // Retrieve all services to get their IDs
        const services = await Service.find({ name: { $in: servicesData.map(s => s.name) } });

        // Step 2: Prepare bulkWrite operations for SubServices
        const subServiceOps: any[] = [];
        services.forEach(service => {
            const correspondingServiceData = servicesData.find(s => s.name === service.name);
            if (correspondingServiceData) {
                correspondingServiceData.subServices.forEach(subService => {
                    subServiceOps.push({
                        updateOne: {
                            filter: { name: subService.name, service_id: service._id }, // Match by name and parent ID
                            update: {
                                $set: {
                                    ...subService,
                                    service_id: service._id
                                }
                            },
                            upsert: true // Insert if not found
                        }
                    });
                });
            }
        });

        // Execute SubService bulkWrite
        const subServiceResult = await SubService.bulkWrite(subServiceOps);

        console.log('Sub-Services Upsert Result:', subServiceResult.isOk());
    } catch (error) {
        console.error('Error inserting/updating services and sub-services:', error);
    }

}

export { migrate }

