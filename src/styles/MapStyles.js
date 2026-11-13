import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from './CommonStyles';
import { reportColors } from './ReportStyles';

export const mapStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: reportColors.canvas,
    },
    header: {
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: reportColors.surface,
        borderBottomWidth: 1,
        borderBottomColor: reportColors.border,
    },
    headerCopy: {
        flex: 1,
    },
    title: {
        color: reportColors.ink,
        fontSize: 20,
        fontWeight: '800',
    },
    subtitle: {
        color: reportColors.muted,
        fontSize: 12,
        marginTop: 3,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        left: 14,
        right: 14,
        top: 14,
        borderRadius: RADIUS.md,
        padding: 13,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderWidth: 1,
        borderColor: reportColors.border,
        ...SHADOWS.card,
    },
    overlayText: {
        color: reportColors.ink,
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 19,
    },
    selectedCard: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        maxWidth: 700,
        alignSelf: 'center',
    },
    actionButton: {
        minHeight: 40,
        borderRadius: 11,
        paddingHorizontal: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: reportColors.accent,
    },
    actionButtonText: {
        color: reportColors.primaryDark,
        fontSize: 13,
        fontWeight: '800',
    },
    webContent: {
        flex: 1,
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        padding: 18,
        gap: 14,
    },
    webList: {
        gap: 12,
        paddingBottom: 32,
    },
    webLocationButton: {
        minHeight: 38,
        alignSelf: 'flex-start',
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: reportColors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    webLocationButtonDisabled: {
        backgroundColor: COLORS.surfaceMuted,
    },
    webLocationText: {
        color: reportColors.primaryDark,
        fontSize: 12,
        fontWeight: '800',
    },
    webLocationTextDisabled: {
        color: reportColors.muted,
    },
});
