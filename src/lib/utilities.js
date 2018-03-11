import keys from '../../config/keys';

// eslint-disable-next-line  import/prefer-default-export
export function handleError(err) {
  /* istanbul ignore next */
  if (keys.displayError) {
    // eslint-disable-next-line no-console
    console.log('ERROR LOG EVENT:', err);
  }
}
