'use client'
import { GarmentType } from "@/lib/types";
import { Card, InputOTP, Key, Label, ListBox, Select } from "@heroui/react";
import { useState } from "react";

export default function Item({ 
    id, 
    icon, 
    garment, 
    material, 
    prevLocation, 
    currentLocation, 
    nextLocation, 
    collection 
}: GarmentType) {
    const [editable, setEditable] = useState<boolean>(false);
    const [value, setValue] = useState<string>(id ?? "");
    const [newGarment, setNewGarment] = useState<Key | null>(garment ?? "");
    const garments = [
        "Playera",
        "Camisa",
        "Cazadora",
        "Hoodie",
        "Pantalón",
        "Bermuda",
        "Calzado",
        "Accesorio",
        "Perfume"
    ]
    return (
        <Card>
            <InputOTP maxLength={9} value={value} onChange={setValue} isDisabled={editable}>
                <InputOTP.Group>
                    <InputOTP.Slot index={0} />
                    <InputOTP.Slot index={1} />
                    <InputOTP.Slot index={2} />
                    <InputOTP.Slot index={3} />
                    <InputOTP.Slot index={4} />
                    <InputOTP.Slot index={5} />
                    <InputOTP.Slot index={6} />
                    <InputOTP.Slot index={7} />
                    <InputOTP.Slot index={8} />
                </InputOTP.Group>
            </InputOTP>

            <Select 
            fullWidth 
            placeholder="Selecciona uno"
            value={newGarment}
            onChange={setNewGarment}>
                <Label>Tipo de prenda</Label>
                <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox>
                    {garments.map((garment) => (
                    <ListBox.Item key={garment} id={garment} textValue={garment}>
                        {garment}
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    ))}
                    </ListBox>
                </Select.Popover>
            </Select>
        </Card>
    )
}