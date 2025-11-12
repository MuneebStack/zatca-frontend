import React, { useEffect, useState } from "react";
import { Modal, Checkbox, Space } from "antd";
import type { ModuleDataType, ModuleType } from "@/types/module";

interface ColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (columns: string[]) => void;
    currentModule: ModuleType;
    accessConfig: Record<string, ModuleDataType>;
}

export const ColumnModal: React.FC<ColumnModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentModule,
    accessConfig
}) => {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    useEffect(() => {
        if (currentModule) {
            const moduleConfig = accessConfig[currentModule.key];
            setSelectedColumns(moduleConfig?.hidden_columns || []);
        } else {
            setSelectedColumns([]);
        }
    }, [currentModule, accessConfig, isOpen]);

    const handleSave = () => {
        onSave(selectedColumns);
        onClose();
    };

    return (
        <Modal
            title={`Select hidden columns for ${currentModule.label}`}
            open={isOpen}
            onOk={handleSave}
            onCancel={onClose}
        >
            <Space direction="vertical">
                {currentModule.columns.map((column) => (
                    <Checkbox
                        key={column}
                        checked={selectedColumns.includes(column)}
                        onChange={(e) => {
                            setSelectedColumns((prev) =>
                                e.target.checked
                                    ? [...prev, column]
                                    : prev.filter((c) => c !== column)
                            );
                        }}
                    >
                        {column}
                    </Checkbox>
                ))}
            </Space>
        </Modal>
    );
}