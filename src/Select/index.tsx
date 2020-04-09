import React, {memo} from 'react'
import {
  Select as MuiSelect,
  MenuItem,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  SelectProps,
} from '@material-ui/core'
import styles from './styles.less'
import {ExpandMore} from '@material-ui/icons'

const CustomizedSelects = ({
  label = '',
  helperText = '',
  width,
  fullWidth,
  IconComponent,
  options,
  ...rest
}: IProps) => {
  if (fullWidth) {
    width = '100%'
  }
  return (
    <Box className={styles.customSelect} width={width}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <MuiSelect fullWidth IconComponent={IconComponent || ExpandMore} {...rest}>
          {options.map((optionItem: IOptions) => (
            <MenuItem key={optionItem.value} value={optionItem.value}>
              {optionItem.text}
            </MenuItem>
          ))}
        </MuiSelect>
        {helperText !== '' && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  )
}

interface IOptions {
  value: string | number
  text: string
}

interface IProps extends SelectProps {
  options: IOptions[]
  label?: string
  helperText?: string
  width?: number | string
}

export const Select = memo(CustomizedSelects)
