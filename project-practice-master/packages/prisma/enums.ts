import type {
	PersonTrialRole,
	GeodataSource,
	TrialLayout,
	MachineStatus,
	StaffRole,
	ContractorService,
	PreferredMessenger,
	MachineType,
	UserType,
	NotificationDeliveryStatus,
	AreaUnit,
	NotificationDeliveryPlatform as NotificationDeliveryPlatformOrigin,
	CompanyType,
	EmployeeRole,
	InvitationStatus,
	CompanyFarmerPermissionType,
	TrialEventCategory,
	MapEngine,
	PhenoInspectTraitDefinitionUnit,
	TrialEventAppliesTo,
	TrialPlotAlignment,
	PlotType,
	TrialStepStatus,
	AgrirouterGatewayId,
	AgrirouterGatewayType,
	GuidanceLineRotateAround,
	TrialType,
	UnitType,
	TrialEventAiDetectionType,
	TrialCategory,
} from "prismaclient";

export type {
	PersonTrialRole,
	GeodataSource,
	TrialLayout,
	MachineStatus,
	StaffRole,
	ContractorService,
	PreferredMessenger,
	MachineType,
	UserType,
	NotificationDeliveryStatus,
	AreaUnit,
	CompanyType,
	EmployeeRole,
	InvitationStatus,
	CompanyFarmerPermissionType,
	TrialEventCategory,
	MapEngine,
	PlotType,
	TrialStepStatus,
	AgrirouterGatewayId,
	AgrirouterGatewayType,
	GuidanceLineRotateAround,
	TrialType,
	UnitType,
	TrialCategory,
};

export const PersonTrialRoleLabels: { [k in PersonTrialRole]: string } = {
	TRIAL_RESPONSIBLE: "Trial Responsible",
	TECHNICAL_RESPONSIBLE: "Technical Responsible",
	LINKED_FARMER: "Linked Farmer",
	TRIAL_OWNER: "Trial Owner",
	TECHNICIAN: "Technician",
	VIEWER: "Viewer",
};

export const GeodataSourceLabels: { [k in GeodataSource]: string } = {
	UPLOAD: "Upload",
	DRAWN: "Drawn",
	GPS: "GPS",
	RTK: "RTK",
};

export const TrialLayoutLabels: { [k in TrialLayout]: string } = {
	STRIPE: "Stripe",
	PLOT: "Plot",
	DEMO: "Demo",
};

export const MachineStatusLabels: { [k in MachineStatus]: string } = {
	ACTIVE: "Active",
	MAINTENANCE: "Maintenance",
	RETIRED: "Retired",
	SOLD: "Sold",
};

export const StaffRoleLabels: { [k in StaffRole]: string } = {
	MANAGER: "Manager",
	OPERATOR: "Operator",
	TECHNICIAN: "Technician",
	ADMIN: "Admin",
	OTHER: "Other",
};

export const ContractorServiceLabels: { [k in ContractorService]: string } = {
	HARVESTING: "Harvesting",
	PLANTING: "Planting",
	SPRAYING: "Spraying",
	FERTILIZING: "Fertilizing",
	CULTIVATION: "Cultivation",
	TRANSPORT: "Transport",
	OTHER: "Other",
};

export const PreferredMessengerLabels: { [k in PreferredMessenger]: string } = {
	WHATSAPP: "WhatsApp",
	TELEGRAM: "Telegram",
	SIGNAL: "Signal",
};

export const AreaUnitLabels: { [k in AreaUnit]: string } = {
	ACRE: "ac",
	HECTARE: "ha",
	SQUARE_METRE: "m²",
};

export const MachineTypeLabels: { [k in MachineType]: string } = {
	CROP_PROTECTION: "Crop Protection",
	CULTIVATION: "Cultivation",
	FERTILIZING: "Fertilizing",
	HARVEST: "Harvest",
	MOWING: "Mowing",
	PLANTING: "Planting",
	SOWING: "Sowing",
	TRACTOR: "Tractor",
	TRAILER: "Trailer",
};

export const UserTypeLabels: { [k in UserType]: string } = {
	ADMIN: "Admin",
	USER: "User",
	READONLY: "Read Only",
};

export const NotificationDeliveryPlatform: {
	[k in NotificationDeliveryPlatformOrigin]: NotificationDeliveryPlatformOrigin;
} = {
	EMAIL: "EMAIL",
	SMS: "SMS",
	PUSH: "PUSH",
	TELEGRAM: "TELEGRAM",
	WHATSAPP: "WHATSAPP",
	SIGNAL: "SIGNAL",
};
export const NotificationDeliveryPlatformLabels: {
	[k in NotificationDeliveryPlatformOrigin]: string;
} = {
	EMAIL: "Email",
	SMS: "SMS",
	PUSH: "Push",
	TELEGRAM: "Telegram",
	WHATSAPP: "WhatsApp",
	SIGNAL: "Signal",
};

export const NotificationDeliveryStatusLabels = {
	PENDING: "Pending",
	SENT: "Sent",
	FAILED: "Failed",
};

export const CompanyTypeLabels: { [k in CompanyType]: string } = {
	AGRO_BUSINESS: "Agro Business",
	CONSULTING: "Consulting",
	FARM: "Farm",
	ORGANISATION: "Organisation",
	UNIVERSITY: "University",
};

export const EmployeeRoleLabels: { [k in EmployeeRole]: string } = {
	MANAGER: "Manager",
	OPERATOR: "Operator",
	TECHNICIAN: "Technician",
	ADMIN: "Admin",
	OWNER: "Owner",
};

export const InvitationStatusLabels: { [k in InvitationStatus]: string } = {
	PENDING: "Pending",
	ACCEPTED: "Accepted",
	DECLINED: "Declined",
};

export const CompanyFarmerPermissionTypeLabels: {
	[k in CompanyFarmerPermissionType]: string;
} = {
	WRITE_DETAILS: "Write Details",
	READ_TRIALS: "Read Trials",
	WRITE_TRIALS: "Write Trials",
	READ_FIELDS: "Read Fields",
	WRITE_FIELDS: "Write Fields",
	READ_CONTRACTORS: "Read Contractors",
	WRITE_CONTRACTORS: "Write Contractors",
	READ_STAFFS: "Read Staffs",
	WRITE_STAFFS: "Write Staffs",
	READ_MACHINES: "Read Machines",
	WRITE_MACHINES: "Write Machines",
};

export const TrialEventCategoryLabels: {
	[k in TrialEventCategory]: string;
} = {
	DRONE_FLIGHT: "Drone Flight",
	FIELD_MANAGEMENT: "Field Management",
	GROWTH_STAGE: "Growth Stage",
	INCIDENT: "Incident",
	NOTE: "Note",
	SAMPLE: "Sample",
	WEATHER: "Weather",
	AI_DETECTION: "AI Detection",
};

export const MapEngineLabels: {
	[k in MapEngine]: string;
} = {
	OPENLAYERS: "OpenLayers",
	LEAFLET: "Leaflet",
	MAPLIBRE: "MapLibre",
};

export const PhenoInspectTraitDefinitionUnitLabels: {
	[k in PhenoInspectTraitDefinitionUnit]: string;
} = {
	PERCENT: "Percentage",
	SQUAREMETER: "Square Meter",
	METER: "Meter",
};

export const TrialEventAppliesToLabels: {
	[k in TrialEventAppliesTo]: string;
} = {
	TRIAL: "Trial",
	BLOCK: "Block",
	PLOT: "Plot",
	VARIANT: "Variant",
};

export const TrialPlotAlignmentLabels: {
	[k in TrialPlotAlignment]: string;
} = {
	LEFT: "Left",
	JUSTIFY: "Justify",
};

export const PlotTypeLabels: { [k in PlotType]: string } = {
	STANDARD: "Standard",
	BORDER: "Border",
	DISABLED: "Disabled",
};

export const TrialStepStatusLabels: { [k in TrialStepStatus]: string } = {
	DRAFT: "Draft",
	CHECKED: "Checked",
	LOCKED: "Locked",
	ALERT: "Alert",
};

export const AgrirouterGatewayIdLabels: {
	[k in AgrirouterGatewayId]: string;
} = {
	MQTT: "MQTT",
	REST: "REST",
};

export const AgrirouterGatewayTypeLabels: {
	[k in AgrirouterGatewayType]: string;
} = {
	PEM: "PEM",
	P12: "P12",
};

export const GuidanceLineRotateAroundLabels: {
	[k in GuidanceLineRotateAround]: string;
} = {
	START_POINT: "Start Point",
	END_POINT: "End Point",
	MIDDLE_POINT: "Middle Point",
};

export const TrialTypeLabels: {
	[k in TrialType]: string;
} = {
	SOWING_TRIAL: "Sowing trial",
	PLANT_PROTECTION_TRIAL: "Plant protection trial",
	VARIETY_TRIAL: "Variety trial",
	FERTILIZER_TRIAL: "Fertilizer trial",
	MANURE_TRIAL: "Manure trial",
	BIOSTIMULANT_TRIAL: "Biostimulant trial",
	MACHINE_TEST: "Machine test",
	TILLAGE_TEST: "Tillage test",
	OTHER: "Other",
	MULTIFACTOR_TRIAL: "Multifactor trial",
};

export const TrialCategoryLabels: {
	[k in TrialCategory]: string;
} = {
	ONFARM: "On-farm",
	EXACT: "Exact",
};

export const UnitTypeLabels: { [k in UnitType]: string } = {
	LENGTH: "Length",
	AREA: "Area",
	VOLUME: "Volume",
	MASS: "Mass",
	TIME: "Time",
	DIMENSIONLESS: "Dimensionless",
	SPEED: "Speed",
	MASS_PER_VOLUME: "Mass per volume",
	VOLUME_PER_AREA: "Volume per area",
	VOLUME_PER_TIME: "Volume per time",
	MASS_PER_AREA: "Mass per area",
	COUNT_PER_AREA: "Count per area",
};

export const TrialEventAiDetectionTypeLabels: {
	[k in TrialEventAiDetectionType]: string;
} = {
	WHEAT_SPIKES: "Wheat Spikes",
};
