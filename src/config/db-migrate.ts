import { Location, ILocation } from '../models/location';
import { Building } from '../models/building';
import { SubBuilding } from '../models/sub-building';
import { Service } from '../models/service';
import { SubService } from '../models/sub-service';

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
            description: 'Elevated Metro Station',
            image: '',
            subBuildings: [
                {
                    type: "Station Building",
                    levels: ["Ground Floor", "Concourse", "Platform", "Roof"]
                },
                {
                    type: "Pump Room",
                    levels: ["DG Room", "Pump Room"]
                },
                {
                    type: "Parking Areas",
                    levels: ["Ground Floor", "First Floor"]
                }
            ]
        },
        {
            type: "Underground Metro Station",
            description: 'Underground Metro Station',
            image: '',
            subBuildings: [
                {
                    type: "Station Building",
                    levels: ["Ground Floor", "Concourse", "Platform", "Undercroft"]
                },
                {
                    type: "Ancillary Building",
                    levels: ["DG Room", "Pump Room", "Water Tank", "First Floor", "Cooling Tower"]
                },
                {
                    type: "Utility Gallery",
                    levels: ["Ground Floor"]
                }
            ]
        },
        {
            type: "Depot",
            description: 'Depot',
            image: '',
            subBuildings: [
                {
                    type: "Admin Building",
                    levels: ["Ground Floor", "First Floor", "Second Floor", "Third Floor", "Terrace"]
                },
                {
                    type: "Workshop Building",
                    levels: ["Ground Floor", "First Floor"]
                },
                {
                    type: "Pump Room",
                    levels: ["Ground Floor", "Water Tank"]
                },
                {
                    type: "ASS Room",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Auto Wash Plant",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Cleaning Contractor Staff Toilet",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Compressor Room",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Etu",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Pit Wheel Lathe",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Scrap Yard",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Store And S&T Cables",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Time Office And Security Building",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Welding Plant",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Storage",
                    levels: ["Ground Floor"]
                },
                {
                    type: "Stabling Yard",
                    levels: ["Ground Floor"]
                }
            ]
        }
    ];

    try {
        // Step 1: Upsert Buildings
        const buildingOperations = buildingsData.map(({ subBuildings, ...building }) => ({
            updateOne: {
                filter: { type: building.type }, // Match on the unique field (e.g., `type`)
                update: { $set: building },
                upsert: true, // Insert if not found
            },
        }));

        const buildingResult = await Building.bulkWrite(buildingOperations);
        console.log('Buildings Upsert Result:', buildingResult.isOk());

        // Fetch the updated/inserting documents
        const updatedBuildings = await Building.find({ type: { $in: buildingsData.map(b => b.type) } });

        // Step 2: Upsert Sub-Buildings
        const subBuildingOperations: any[] = [];
        updatedBuildings.forEach((buildingDoc) => {
            const buildingData = buildingsData.find(b => b.type === buildingDoc.type);
            if (!buildingData) return;

            buildingData.subBuildings.forEach((subBuilding) => {
                subBuildingOperations.push({
                    updateOne: {
                        filter: {
                            building_id: buildingDoc._id,
                            type: subBuilding.type,
                        },
                        update: { $set: { ...subBuilding, building_id: buildingDoc._id } },
                        upsert: true,
                    },
                });
            });
        });

        const subBuildingResult = await SubBuilding.bulkWrite(subBuildingOperations);
        console.log('Sub-Buildings Upsert Result:', subBuildingResult.isOk());
    } catch (error) {
        console.error(error);
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

