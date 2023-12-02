import { ChipProps } from '@nextui-org/react';

export const courseStatusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    WAITING: 'primary',
    UPDATING: 'primary',
    DRAFT: 'default',
    UNAVAILABLE: 'warning'
};

export const transactionStatusColorMap: Record<string, ChipProps['color']> = {
    SUCCESS: 'success',
    RECEIVED: 'success',
    REFUND_SUCCES: 'success',
    FAIL: 'danger',
    PENDING: 'warning',
    REFUND: 'warning',
    NOTYET: 'danger',
    REJECT_REFUND: 'danger'
};
export const reportColorMap: Record<string, ChipProps['color']> = {
    NEW: 'warning',
    DONE: 'success'
};
