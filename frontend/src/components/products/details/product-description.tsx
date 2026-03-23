import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton } from "react-native-paper";

interface ProductDescriptionProps {
    description: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function ProductDescription({
    description,
    isExpanded,
    onToggle,
}: ProductDescriptionProps) {
    return (
        <View>
            <TouchableOpacity
                style={styles.accordionHeader}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <IconButton
                    icon={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    style={{ margin: 0 }}
                />
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.accordionContent}>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    accordionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1E1E1E" },
    accordionContent: { paddingTop: 16 },
    descriptionText: { fontSize: 14, color: "#8A8A8A", lineHeight: 22 },
});
