import { ChipProps } from '@nextui-org/react';

export const courseStatusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    WAITING: 'primary',
    UPDATING: 'primary',
    DRAFT: 'primary',
    UNAVAILABLE: 'warning'
};

export const transactionStatusColorMap: Record<string, ChipProps['color']> = {
    SUCCESS: 'success',
    FAIL: 'danger',
    PENDING: 'warning'
};
