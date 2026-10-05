/**
 *  The shared UI utility functions for this Public module
 */
// Calculate business status badge
export const calculateBusinessStatusBadge = (status: string) => {
  switch (status) {
    case 'Nghỉ hoạt động':
      return 'badge-warning';
    case 'Đang hoạt động':
      return 'badge-success';
    case 'Không hoạt động':
      return 'badge-danger';
    default:
      return 'badge-warning';
  }
};

// Calculate permit fee status badge
export const calculatePermitFeeStatusBadge = (status: string) => {
  switch (status) {
    case 'Chưa nộp':
    case 'Đang nộp':
      return 'badge-warning';

    case 'Đã nộp':
      return 'badge-success';

    default:
      return 'badge-warning';
  }
};

// Calculate construction status badge
export const calculateConstructionStatusBadge = (status: string) => {
  switch (status) {
    case 'Chưa xây':
    case 'Đang xây':
      case 'Đã định vị móng':
      return 'badge-warning';

    case 'Đã xây':
      return 'badge-success';

    default:
      return 'badge-warning';
  }
};

/**
 * Populate business full address
 * @param business Business object
 */
export const populateBusinessFullAddress = (business: any) => {
  if (!business) {
    return 'Địa chỉ không khả dụng!';
  }

  const addresses = [];

  // Street address
  if (business.DiaChi) {
    addresses.push(business.DiaChi);
  }
  // Ward
  if (business.WardName) {
    addresses.push(business.WardName);
  }
  // City
  if (business.DistrictName) {
    addresses.push(business.DistrictName);
  }
  // Province
  if (business.ProvinceName) {
    addresses.push(business.ProvinceName);
  }

  return addresses.join(', ');
};

/**
 * Populate permit full address
 * @param permit Permit object
 */
export const populatePermitFullAddress = (permit: any) => {
  if (!permit) {
    return 'Địa chỉ không khả dụng!';
  }

  const addresses = [];

  // Street address
  if (permit.DiaChi) {
    addresses.push(permit.DiaChi);
  }
  // Street address
  if (permit.StreetName) {
    addresses.push(permit.StreetName);
  }
  // Ward
  if (permit.WardName) {
    addresses.push(permit.WardName);
  }
  // City
  if (permit.DistrictName) {
    addresses.push(permit.DistrictName);
  }
  // Province
  if (permit.ProvinceName) {
    addresses.push(permit.ProvinceName);
  }

  return addresses.join(', ');
};
