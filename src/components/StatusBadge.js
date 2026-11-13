import { Text } from 'react-native';
import { REPORT_STATUS } from '../constants/reportConstants';
import { StyleSheet } from 'react-native';

const statusColors = {
    [REPORT_STATUS.PENDING]: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', color: '#92400E' },
    [REPORT_STATUS.UNDER_REVIEW]: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E40AF' },
    [REPORT_STATUS.RESOLVED]: { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0', color: '#166534' },
    [REPORT_STATUS.CANCELLED]: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', color: '#475569' },
};

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontSize: 11,
        fontWeight: '700',
        overflow: 'hidden',
    },
});

export default function StatusBadge({ status }) {
    const colors = statusColors[status] || statusColors[REPORT_STATUS.PENDING];
    return <Text style={[styles.badge, colors]}>{status || REPORT_STATUS.PENDING}</Text>;
}
