import { ChangeEvent, FocusEvent } from 'react';
import {
  ariaDescribedByIds,
  BaseInputTemplateProps,
  examplesId,
  FormContextType,
  getInputProps,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { cn } from '../lib/utils';
import { Input } from '../components/ui/input';

export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  type,
  value,
  onChange,
  onChangeOverride,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  rawErrors = [],
  children,
  extraProps,
}: BaseInputTemplateProps<T, S, F>) {
  const inputProps = {
    ...extraProps,
    ...getInputProps<T, S, F>(schema, type, options),
  };
  const _onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    onChange(value === '' ? options.emptyValue : value);
  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) => onBlur(id, target && target.value);
  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) => onFocus(id, target && target.value);

  return (
    <div className='p-0.5'>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoFocus={autofocus}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        className={cn({ 'border-destructive focus-visible:ring-0': rawErrors.length > 0 })}
        list={schema.examples ? examplesId<T>(id) : undefined}
        {...inputProps}
        value={value || value === 0 ? value : ''}
        onChange={onChangeOverride || _onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
      />
      {children}
      {Array.isArray(schema.examples) ? (
        <datalist id={examplesId<T>(id)}>
          {(schema.examples as string[])
            .concat(schema.default && !schema.examples.includes(schema.default) ? ([schema.default] as string[]) : [])
            .map((example: any) => {
              return <option key={example} value={example} />;
            })}
        </datalist>
      ) : null}
    </div>
  );
}
