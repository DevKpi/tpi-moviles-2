import { Platform, StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#1d4ed8',
    primaryDark: '#1e3a8a',
    primaryLight: '#dbeafe',
    accent: '#d97706',
    accentLight: '#fef3c7',
    success: '#15803d',
    successLight: '#dcfce7',
    danger: '#dc2626',
    dangerLight: '#fee2e2',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#f1f5f9',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#e2e8f0',
    borderFocus: '#2563eb',
    white: '#ffffff',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
};

export const SHADOWS = {
    card: Platform.select({
        ios: {
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
        },
        android: {
            elevation: 3,
        },
        default: {
            boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.06)',
        },
    }),
};

export const commonStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    // Estilos para CustomButton
    buttonBase: {
        minHeight: 50,
        borderRadius: RADIUS.md,
        paddingVertical: 13,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
    },
    buttonSecondary: {
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    buttonDanger: {
        backgroundColor: COLORS.dangerLight,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    buttonGhost: {
        backgroundColor: 'transparent',
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    buttonPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },
    buttonTextBase: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    buttonTextPrimary: {
        color: COLORS.white,
    },
    buttonTextSecondary: {
        color: COLORS.primary,
    },
    buttonTextDanger: {
        color: COLORS.danger,
    },
    buttonTextGhost: {
        color: COLORS.textSecondary,
    },
    // Estilos para CustomInput
    inputWrapper: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 14,
        minHeight: 50,
    },
    inputContainerFocused: {
        borderColor: COLORS.borderFocus,
    },
    inputContainerError: {
        borderColor: COLORS.danger,
        backgroundColor: '#fff5f5',
    },
    inputField: {
        flex: 1,
        fontSize: 15,
        color: COLORS.textPrimary,
        paddingVertical: 12,
    },
    inputFieldMultiline: {
        minHeight: 96,
        textAlignVertical: 'top',
    },
    inputToggleButton: {
        paddingLeft: 10,
        paddingVertical: 6,
    },
    inputToggleText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },
    inputErrorText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.danger,
        marginTop: 5,
    },
    inputHelperText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 5,
    },
    // Estilos para ScreenHeader
    headerContainer: {
        backgroundColor: COLORS.surface,
        paddingTop: Platform.OS === 'ios' ? 54 : 42,
        paddingBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    headerBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.pill,
    },
    headerBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    headerBackButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surfaceMuted,
    },
    headerBackText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
        lineHeight: 20,
    },
    // Estilos para LoadingState
    loadingWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    loadingMessage: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
