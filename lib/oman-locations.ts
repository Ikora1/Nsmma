/**
 * Supported Governorates in the Sultanate of Oman (محافظات سلطنة عُمان)
 * Client-safe constants for checkout forms and delivery fee calculation.
 */
export const OMAN_GOVERNORATES = [
  { id: 'muscat', nameAr: 'مسقط', deliveryFeeOmr: 2.0 },
  { id: 'dhofar', nameAr: 'ظفار', deliveryFeeOmr: 3.5 },
  { id: 'dakhiliyah', nameAr: 'الداخلية', deliveryFeeOmr: 2.5 },
  { id: 'north_batinah', nameAr: 'شمال الباطنة', deliveryFeeOmr: 2.5 },
  { id: 'south_batinah', nameAr: 'جنوب الباطنة', deliveryFeeOmr: 2.0 },
  { id: 'north_sharqiyah', nameAr: 'شمال الشرقية', deliveryFeeOmr: 2.5 },
  { id: 'south_sharqiyah', nameAr: 'جنوب الشرقية', deliveryFeeOmr: 2.5 },
  { id: 'dhahirah', nameAr: 'الظاهرة', deliveryFeeOmr: 3.0 },
  { id: 'buraimi', nameAr: 'البريمي', deliveryFeeOmr: 3.0 },
  { id: 'wusta', nameAr: 'الوسطى', deliveryFeeOmr: 4.0 },
  { id: 'musandam', nameAr: 'مسندم', deliveryFeeOmr: 4.0 },
] as const

export type OmanGovernorateId = typeof OMAN_GOVERNORATES[number]['id']
