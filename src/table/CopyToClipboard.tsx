/* eslint-disable react/prop-types */
import { convertArrayToCSV } from 'convert-array-to-csv';
import React, { FC, useMemo, TextareaHTMLAttributes } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { MUIDataTableColumn } from 'mui-datatables';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RCTC from 'react-copy-to-clipboard';

import _ from 'lodash';
import styles from './styles.less';

// const copyToClipboard = (str: string) => {
//   let copyTextarea = document.querySelector('#js-copytextarea') as HTMLTextAreaElement;
//   if (!copyTextarea) {
//     copyTextarea = document.createElement('textarea');
//     copyTextarea.id = 'js-copytextarea';
//     copyTextarea.setAttribute('readonly', '');
//     copyTextarea.style.position = 'absolute';
//     copyTextarea.style.left = '-9999px';
//     document.body.appendChild(copyTextarea);
//   }
//   copyTextarea.value = str;
//   copyTextarea.focus();
//   copyTextarea.select();
//   try {
//     const successful = document.execCommand('copy');
//     const msg = successful ? 'successful' : 'unsuccessful';
//     console.log('Copying text command was ' + msg);
//   } catch (err) {
//     console.log('Oops, unable to copy');
//   }
// };

interface Props {
  data: Array<Record<string, any> | string[]>;
  headers: MUIDataTableColumn[];
}
export const CopyToClipboard: FC<Props> = ({ data, headers }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const csv = useMemo<string>(() => {
    const shownHeaders = headers.filter((column) => _.get(column, ['options', 'download'], true));
    const normalizedData = data.map((item) =>
      item instanceof Array
        ? item
        : shownHeaders.map((column) => {
            const copyName = (column as any).copyName;
            const copyRender = (column as any).copyRender;
            const text = item[copyName] || item[column.name];
            if (copyRender) {
              return _.isString(copyRender) ? copyRender : copyRender(text);
            }
            return text;
          })
    );
    return convertArrayToCSV(normalizedData, {
      header: shownHeaders.map((h) => h.label || h.name),
      separator: '\t',
    });
  }, [data, headers]);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3 * 1000}
        onClose={handleClose}
        message="Copy Successd"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{ classes: { root: styles.snackbar, action: styles.snackbarAction } }}
        action={<span>x</span>}
      />
      <Tooltip title="Copy to Clipboard">
        <span>
          <RCTC text={csv} options={{ format: 'text/plain' }}>
            <IconButton color="primary" aria-label="add to shopping cart">
              <AddShoppingCartIcon />
            </IconButton>
          </RCTC>
        </span>
      </Tooltip>
    </>
  );
};
