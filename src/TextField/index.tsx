import React from "react";
import { TextField as MuiTextField, TextFieldProps } from "@material-ui/core";
import classnames from "classnames";
import styles from "./styles.less";
interface IInputProps {
  width?: number | string;
}
const TextField = ({
  width,
  className,
  InputProps,
  ...props
}: TextFieldProps & IInputProps) => (
  <MuiTextField
    className={classnames(className, styles.inputContainer)}
    {...props}
    style={{ width }}
    InputProps={{
      classes: {
        root: styles.inputRoot,
        inputMultiline: styles.inputMultiline,
        input: styles.input,
        focused: styles.focused,
        disabled: styles.disabled
      } as any,
      ...InputProps
    }}
  />
);
export { TextField };
