import { Text } from 'react-native';
import { REPORT_STATUS } from '../constants/reportConstants';
import { StyleSheet } from 'react-native';

const statusColors = {
    [REPORT_STATUS.PENDING]: { backgroundColor: '#FFF3D5', color: '#845A00' },
    [REPORT_STATUS.UNDER_REVIEW]: { backgroundColor: '#E4F0FF', color: '#275E9A' },
    [REPORT_STATUS.RESOLVED]: { backgroundColor: '#DDF4E8', color: '#236945' },
    [REPORT_STATUS.CANCELLED]: { backgroundColor: '#ECEFF2', color: '#53616F' },
};

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 11,
        fontWeight: '800',
        overflow: 'hidden',
    },
});

export default function StatusBadge({ status }) {
    const colors = statusColors[status] || statusColors[REPORT_STATUS.PENDING];
    return <Text style={[styles.badge, colors]}>{status || REPORT_STATUS.PENDING}</Text>;
}
