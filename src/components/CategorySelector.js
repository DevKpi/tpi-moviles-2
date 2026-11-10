import { Pressable, Text, View } from 'react-native';
import { REPORT_CATEGORIES } from '../constants/reportConstants';
import { reportStyles as styles } from '../styles/ReportStyles';

export default function CategorySelector({ value, onChange, disabled = false }) {
    return (
        <View style={styles.categoryList}>
            {REPORT_CATEGORIES.map((category) => {
                const selected = value === category;
                return (
                    <Pressable
                        key={category}
                        accessibilityRole="button"
                        accessibilityState={{ selected, disabled }}
                        disabled={disabled}
                        onPress={() => onChange(category)}
                        style={[styles.categoryChip, selected && styles.categoryChipSelected, disabled && styles.buttonDisabled]}
                    >
                        <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                            {category}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
