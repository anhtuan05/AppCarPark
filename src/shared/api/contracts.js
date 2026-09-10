import { z } from 'zod';

const normalizeStatus = (value) => {
  const rawStatus = String(value ?? 'unknown').trim().toLowerCase().replace(/[\s-]+/g, '_');
  const aliases = {
    free: 'available',
    empty: 'available',
    unavailable: 'occupied',
    taken: 'occupied',
    booked: 'reserved',
    approved: 'confirmed',
    canceled: 'cancelled',
    inactive: 'expired',
  };

  return aliases[rawStatus] || rawStatus || 'unknown';
};

const booleanSchema = z.preprocess((value) => {
  if (value === 1 || value === '1' || value === 'true') return true;
  if (value === 0 || value === '0' || value === 'false') return false;
  return value;
}, z.boolean());

const idSchema = z.coerce.number().int().nonnegative();
const referenceIdSchema = z.preprocess(
  (value) => (value && typeof value === 'object' ? value.id : value),
  idSchema,
);
const optionalReferenceIdSchema = z.preprocess(
  (value) => (value && typeof value === 'object' ? value.id : value),
  idSchema.nullish(),
);
const statusSchema = z.preprocess(normalizeStatus, z.string().min(1));
const nullableString = z.string().nullable().optional();

export class ApiContractError extends Error {
  constructor(contractName, issues) {
    super(`Invalid API response for ${contractName}`);
    this.name = 'ApiContractError';
    this.code = 'API_CONTRACT_INVALID';
    this.contractName = contractName;
    this.issues = issues;
  }
}

export function parseResponse(schema, payload, contractName) {
  const result = schema.safeParse(payload);
  if (result.success) return result.data;
  throw new ApiContractError(contractName, result.error.issues);
}

export function listResponseSchema(itemSchema) {
  return z.union([
    z.array(itemSchema),
    z.object({ results: z.array(itemSchema) }).passthrough(),
  ]).transform((payload) => (Array.isArray(payload) ? payload : payload.results));
}

export const authTokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: nullableString,
  token_type: z.string().optional(),
  expires_in: z.coerce.number().positive().optional(),
}).passthrough();

export const userSchema = z.object({
  id: idSchema,
  username: z.string().min(1),
  first_name: z.string().default(''),
  last_name: z.string().default(''),
  email: z.string().default(''),
  phone_number: z.string().nullish().transform((value) => value || ''),
  date_of_birth: z.string().nullish().transform((value) => value || ''),
  is_staff: booleanSchema.default(false),
  is_superuser: booleanSchema.default(false),
}).passthrough();

export const parkingLotSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  address: z.string().nullish().transform((value) => value || ''),
  price_per_hour: z.coerce.number().nonnegative(),
}).passthrough();

export const parkingSpotSchema = z.object({
  id: idSchema,
  parkinglot: referenceIdSchema,
  status: statusSchema,
}).passthrough();

export const vehicleSchema = z.object({
  id: idSchema,
  license_plate: z.string().min(1),
  brand: z.string().nullish().transform((value) => value || ''),
  car_model: z.string().nullish().transform((value) => value || ''),
  color: z.string().nullish().transform((value) => value || ''),
}).passthrough();

export const bookingSchema = z.object({
  id: idSchema,
  spot: referenceIdSchema,
  vehicle: optionalReferenceIdSchema,
  vehicle_license_plate: nullableString,
  start_time: z.string(),
  end_time: z.string(),
  total_hours: z.coerce.number().nonnegative().optional(),
  status: statusSchema.default('pending'),
  short_link: nullableString,
}).passthrough();

export const actionResponseSchema = z.object({
  short_link: nullableString,
}).passthrough();

export const subscriptionTypeSchema = z.object({
  id: idSchema,
  type: z.string().min(1),
  total_amount: z.coerce.number().nonnegative(),
  duration_days: z.coerce.number().positive().optional(),
}).passthrough();

export const subscriptionSchema = z.object({
  id: idSchema,
  subscription_type: optionalReferenceIdSchema,
  subscription_type_name: z.string().default(''),
  spot: referenceIdSchema,
  start_date: z.string(),
  end_date: z.string(),
  status: statusSchema.default('active'),
  short_link: nullableString,
}).passthrough();

const reviewParkingLotSchema = z.union([
  idSchema,
  z.object({ id: idSchema, name: z.string().default('') }).passthrough(),
]);

export const reviewSchema = z.object({
  id: idSchema,
  parkinglot: reviewParkingLotSchema,
  parkinglot_name: nullableString,
  rate: z.coerce.number().min(1).max(5),
  comment: z.string().default(''),
  user: referenceIdSchema,
}).passthrough();

export const parkingRatingSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  rates_1: z.coerce.number().nonnegative().default(0),
  rates_2: z.coerce.number().nonnegative().default(0),
  rates_3: z.coerce.number().nonnegative().default(0),
  rates_4: z.coerce.number().nonnegative().default(0),
  rates_5: z.coerce.number().nonnegative().default(0),
  average_rate: z.coerce.number().min(0).max(5).default(0),
  total_reviews: z.coerce.number().nonnegative().default(0),
}).passthrough();

export const revenueDataSchema = z.record(z.string(), z.coerce.number().nonnegative());

export const parkingHistorySchema = z.object({
  id: idSchema,
  spot: optionalReferenceIdSchema,
  vehicle_license_plate: nullableString,
  entry_time: nullableString,
  exit_time: nullableString,
  status: statusSchema.optional(),
}).passthrough();

export const paymentSchema = z.object({
  id: idSchema,
  amount: z.coerce.number().nonnegative().default(0),
  created_at: nullableString,
  payment_method: nullableString,
  status: statusSchema.optional(),
}).passthrough();

export const entryExitSchema = z.object({
  id: idSchema.optional(),
  spot: optionalReferenceIdSchema,
  subscription: optionalReferenceIdSchema,
  booking: optionalReferenceIdSchema,
  entry_time: nullableString,
  exit_time: nullableString,
}).passthrough();

export const plateRecognitionSchema = z.object({
  results: z.array(z.object({ plate: z.string().min(1) }).passthrough()),
}).passthrough();
