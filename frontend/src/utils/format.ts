import { Address } from '@/services/address.service';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);
};

export const formatFullAddress = (addr: Address) => {
  const parts = [addr.streetAddress, addr.ward, addr.district, addr.province].filter(Boolean);
  return parts.join(', ');
};
