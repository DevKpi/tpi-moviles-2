import { Image, Pressable, Text, View } from 'react-native';
import { isValidCoordinates, REPORT_STATUS } from '../constants/reportConstants';
import { formatReportDate } from '../services/reportValidation';
import { reportStyles as styles } from '../styles/ReportStyles';
import StatusBadge from './StatusBadge';

export default function ReportCard({
    report,
    onEdit,
    onCancel,
    onDelete,
    actions = false,
    showPhoto = true,
    extraAction = null,
}) {
    const canEdit = report.estado === REPORT_STATUS.PENDING;
    const canCancel = [REPORT_STATUS.PENDING, REPORT_STATUS.UNDER_REVIEW].includes(report.estado);
    const coordinates = report.coordenadas;
    const hasCoordinates = Boolean(coordinates && isValidCoordinates(coordinates));

    return (
        <View style={styles.card}>
            <View style={styles.cardMain}>
                {showPhoto && report.fotoUri ? (
                    <Image source={{ uri: report.fotoUri }} style={styles.thumbnail} accessibilityLabel="Foto del reclamo" />
                ) : showPhoto ? (
                    <View style={styles.thumbnailPlaceholder}>
                        <Text style={styles.thumbnailPlaceholderText}>Sin foto</Text>
                    </View>
                ) : null}
                <View style={styles.cardCopy}>
                    <View style={styles.row}>
                        <Text style={styles.cardTitle}>{report.titulo}</Text>
                        <StatusBadge status={report.estado} />
                    </View>
                    <Text style={styles.cardMeta}>{report.categoria} · {formatReportDate(report.fechaCreacion)}</Text>
                    {hasCoordinates ? (
                        <Text style={styles.cardMeta}>
                            {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                        </Text>
                    ) : (
                        <Text style={styles.cardMeta}>Ubicación no informada</Text>
                    )}
                </View>
            </View>
            {!!report.descripcion && <Text style={styles.cardDescription}>{report.descripcion}</Text>}
            {(actions || extraAction) && (
                <View style={styles.cardActions}>
                    {actions && onEdit && canEdit && (
                        <Pressable accessibilityRole="button" onPress={() => onEdit(report)} style={styles.smallAction}>
                            <Text style={styles.smallActionText}>Editar</Text>
                        </Pressable>
                    )}
                    {actions && onCancel && canCancel && (
                        <Pressable accessibilityRole="button" onPress={() => onCancel(report)} style={styles.smallAction}>
                            <Text style={styles.smallActionText}>Cancelar reclamo</Text>
                        </Pressable>
                    )}
                    {actions && onDelete && (
                        <Pressable accessibilityRole="button" onPress={() => onDelete(report)} style={[styles.smallAction, styles.smallActionDanger]}>
                            <Text style={styles.smallActionTextDanger}>Eliminar</Text>
                        </Pressable>
                    )}
                    {extraAction}
                </View>
            )}
        </View>
    );
}
