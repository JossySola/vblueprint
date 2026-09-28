'use client'
import { GarmentType, ProductCategory } from "@/lib/types";
import { Button, ColorArea, ColorPicker, ColorSlider, ComboBox, ColorSwatch, Input, InputOTP, Key, Label, ListBox, Modal, parseColor, Select, useOverlayState } from "@heroui/react";
import { Dispatch, SetStateAction, startTransition, useOptimistic, useState } from "react";
import { saveNewItem, saveNewLabel } from "../actions";
import { PlusShapeFill } from "@gravity-ui/icons";

export default function NewItemModal({ layoutId, storedLabels, products, setProducts }: { 
    layoutId: string,
    storedLabels: Array<ProductCategory>,
    products: GarmentType[],
    setProducts: Dispatch<SetStateAction<GarmentType[]>>
}) {
    const state = useOverlayState();
    const [optimisticLabels, setOptimisticLabels] = useOptimistic(storedLabels);
    const [SKU, setSKU] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [garment, setGarment] = useState<Key | null>("");
    const [label, setLabel] = useState<string>("");
    const [material, setMaterial] = useState<string>("");
    const [collection, setCollection] = useState<string>("");
    const [color, setColor] = useState(parseColor("#325578"));
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
    ];

    function handleAddLabel(label: string) {
        startTransition(async () => {
            setOptimisticLabels(prev => {
                const newLabels = Array.from(prev);
                newLabels.push({
                    name: label,
                    color: "",
                    id: crypto.randomUUID(),
                });
                return newLabels;
            });
            await saveNewLabel(layoutId, optimisticLabels);
            setLabel("");
        });
    }

    return (
        <>
        <Button variant="tertiary" onPress={() => state.open()}>Add product</Button>
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Icon>

                        </Modal.Icon>
                        <Modal.Heading>

                        </Modal.Heading>
                    </Modal.Header>
                    <Modal.Body className="flex flex-col gap-5">
                        <Label>SKU:</Label>
                        <InputOTP maxLength={9} value={SKU} onChange={setSKU}>
                            <InputOTP.Group>
                                <InputOTP.Slot index={0} />
                                <InputOTP.Slot index={1} />
                                <InputOTP.Slot index={2} />
                                <span className="text-2xl">-</span>
                                <InputOTP.Slot index={3} />
                                <InputOTP.Slot index={4} />
                                <InputOTP.Slot index={5} />
                                <span className="text-2xl">-</span>
                                <InputOTP.Slot index={6} />
                                <InputOTP.Slot index={7} />
                                <InputOTP.Slot index={8} />
                            </InputOTP.Group>
                        </InputOTP>

                        <Label>Name of product:</Label>
                        <Input name="name" value={name} onChange={e => setName(e.target.value)} />

                        <Label>Collection:</Label>
                        <Input name="collection" value={collection} onChange={e => setCollection(e.target.value)} />

                        <Label>Type of garment:</Label>
                        <Select 
                        fullWidth 
                        placeholder="Selecciona uno"
                        value={garment}
                        onChange={setGarment}>
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

                        <Label>Labels:</Label>
                        <ComboBox name="labels" inputValue={label} onInputChange={setLabel}>
                            <ComboBox.InputGroup className="flex flex-row justify-center items-center">
                                <div className="w-full">
                                    <Input name="label" value={label} onChange={e => setLabel(e.target.value)} />
                                    <Button isIconOnly isDisabled={!label.length} className="relative right-1/12 bottom-0" size="sm" variant="tertiary" onPress={() => handleAddLabel(label)}><PlusShapeFill /></Button>
                                </div>
                                <ComboBox.Trigger />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover>
                                <ListBox>
                                    {
                                        optimisticLabels && optimisticLabels.map((storedLabel, index) => {
                                            return (
                                                <ListBox.Item key={index} id={storedLabel.name} textValue={storedLabel.name}>
                                                    {storedLabel.name}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            )
                                        })
                                    }
                                </ListBox>
                            </ComboBox.Popover>
                        </ComboBox>

                        <Label>Color:</Label>
                        <ColorPicker value={color} onChange={setColor}>
                        <ColorPicker.Trigger>
                            <ColorSwatch size="lg" />
                            <Label>Pick a color</Label>
                        </ColorPicker.Trigger>
                        <ColorPicker.Popover>
                            <ColorArea
                            aria-label="Color area"
                            className="max-w-full"
                            colorSpace="hsb"
                            xChannel="saturation"
                            yChannel="brightness"
                            >
                            <ColorArea.Thumb />
                            </ColorArea>
                            <ColorSlider channel="hue" className="gap-1 px-1" colorSpace="hsb">
                            <Label>Hue</Label>
                            <ColorSlider.Output className="text-muted" />
                            <ColorSlider.Track>
                                <ColorSlider.Thumb />
                            </ColorSlider.Track>
                            </ColorSlider>
                        </ColorPicker.Popover>
                        </ColorPicker>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={async () => {
                            const itemExists = products.find(product => product.name === name);
                            if (itemExists) {
                                return;
                            } else {
                                const newItem = {
                                    id: crypto.randomUUID().toString(),
                                    name,
                                    icon: "",
                                    garment: garment ? garment.toString() : "",
                                    material,
                                    prevLocation: "",
                                    currentLocation: "",
                                    nextLocation: "",
                                    collection,
                                };
                                setProducts(prev => {
                                    const newProducts = Array.from(prev);
                                    newProducts.push(newItem);
                                    return newProducts;
                                });
                                const newArray = Array.from(products);
                                newArray.push(newItem);
                                await saveNewItem(layoutId, newArray);
                            }
                            setSKU("");
                            setName("");
                            setGarment("");
                            setLabel("");
                            setMaterial("");
                            setCollection("");
                            setColor(parseColor("#325578"));
                        }}>Add Item</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
        </>
    )
}