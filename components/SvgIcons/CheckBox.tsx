import { Check as CheckIcon } from '@tamagui/lucide-icons'
import type { CheckboxProps } from 'tamagui'
import { Checkbox, Label, XStack } from 'tamagui'




export function CheckboxWithLabel({
    size,
    label,
    ...checkboxProps
  }: CheckboxProps & { label?: string }) {
    const id = `checkbox-${(size || '').toString().slice(1)}`
    return (
      <XStack width={140} style={{alignItems: 'center'}} gap="$2">
        <Checkbox id={id} size={size} {...checkboxProps}>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox>
  
        <Label size={size} htmlFor={id}>
          {label}
        </Label>
      </XStack>
    )
  }