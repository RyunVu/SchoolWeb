/**
 * The search entity interface
 */
export interface SearchEntity {
  // Common fields
  keyword?: string;
  streetAddr?: string;
  city?: string;
  ward?: string;
  id?: string;
  pageIndex?: number;
  pageSize?: number;
  // Non common fields
  hasCertification?: boolean;
  businessType?: string;
  constructionStatus?: number;
  feeStatus?: number;
  revenueFrom?: number;
  revenueTo?: number;
  taxFrom?: number;
  taxTo?: number;
  status?: string;
  loaiHinh?: number;
}

/**
 * Construction status
 */
export enum ConstructionStatus {
  NotBuild = -1,
  Building = 1,
  Built = 2,
}

/**
 * Fee status
 */
export enum FeeStatus {
  NotPaid = -1,
  Collecting = 1,
  Paid = 2,
}

export enum HKDStatus {
  DangHoatDong = '00',
  NgungHDXongThuTuc = '01',
  NgungHDChuaThuTuc = '03',
  DangHDChuaThuTuc = '04',
  TamNgungHoatDong = '05',
  KhongHDTaiDCDK = '06',
}
