/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore, Store } from "@reduxjs/toolkit";
import { invariant } from "@rxdrag/shared";
import { ADD_FORM_FIELDS, CREATE_FORM, FormActionPayload, REMOVE_FORM, REMOVE_FORM_FIELDS, SetFieldValuePayload, SET_FIELD_INITIAL_VALUE, SET_FIELD_VALUE, SET_FORM_INITIAL_VALUE, SET_FORM_VALUE, SetFieldStatePayload, SET_FIELD_STATE, SET_FORM_INITIALIZED_FLAG, SET_FORM_DEFAULT_VALUE, SET_FIELD_DEFAULT_VALUE, INPUT_FIELD_VALUE, SET_FORM_FIELDS_FEEDBACKS, SetFormFeedbacksPayload, IFieldFeedback } from "../actions";
import { FieldChangeListener, FieldState, FieldValueChangeListener, FormChangeListener, FormState, FormValue, FormValueChangeListener, IAction, IFieldSchema, IFieldyEngine, IForm, IFormProps, Unsubscribe } from "../interfaces/fieldy";
import { reduce, State } from "../reducers";
import { FormImpl } from "./FormImpl";
import { FormHelper } from "../reducers/forms/form/helpers";
import { IValidationError, IValidator } from "../interfaces";

let idSeed = 0

function makeId() {
  idSeed = idSeed + 1;

  return "form-" + idSeed
}

/**
 * 建议一个应用只创建一个Fieldy实例
 */
export class FieldyEngineImpl implements IFieldyEngine {
  store: Store<State>

  forms: {
    [name: string]: IForm | undefined
  } = {}

  constructor(public validator: IValidator | undefined, debugMode?: boolean,) {
    this.store = makeStoreInstance(debugMode || false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createForm(_options?: IFormProps): IForm {
    const name = makeId()
    this.dispatch({
      type: CREATE_FORM,
      payload: {
        formName: name,
      }
    })

    const form = new FormImpl(this, name)
    this.forms[name] = form;
    return form
  }

  removeForm(name: string): void {
    this.dispatch({
      type: REMOVE_FORM,
      payload: {
        formName: name,
      }
    })

    delete this.forms[name]
  }

  addFields(formName: string, ...fieldSchemas: IFieldSchema[]): void {
    this.dispatch({
      type: ADD_FORM_FIELDS,
      payload: {
        formName: formName,
        fieldSchemas: fieldSchemas,
      }
    })
  }
  removeFields(formName: string, ...fieldPaths: string[]): void {
    this.dispatch({
      type: REMOVE_FORM_FIELDS,
      payload: {
        formName: formName,
        paths: fieldPaths,
      }
    })
  }

  setFormInitialValue(name: string, value: FormValue | undefined): void {
    this.store.dispatch({
      type: SET_FORM_INITIAL_VALUE,
      payload: {
        formName: name,
        value: value,
      }
    })

    this.store.dispatch({
      type: SET_FORM_INITIALIZED_FLAG,
      payload: {
        formName: name,
        initialized: true,
      }
    })
  }


  setFormDefaultValue(name: string, value: FormValue | undefined): void {
    this.store.dispatch({
      type: SET_FORM_DEFAULT_VALUE,
      payload: {
        formName: name,
        value: value,
      }
    })
  }

  setFormValue(name: string, value: FormValue | undefined): void {
    this.store.dispatch({
      type: SET_FORM_VALUE,
      payload: {
        formName: name,
        value: value,
      }
    })
  }

  setValidationFeedbacks(formName: string, feedbacks: IFieldFeedback[]): void {
    const payload: SetFormFeedbacksPayload = {
      formName: formName,
      feedbacks: feedbacks,
    }
    this.store.dispatch({
      type: SET_FORM_FIELDS_FEEDBACKS,
      payload: payload
    })
  }

  getForm(name: string): IForm | undefined {
    return this.forms[name]
  }

  getFormState(name: string): FormState | undefined {
    return this.store.getState().forms[name]
  }

  subscribeToFormInitialized(name: string, listener: FormChangeListener): Unsubscribe {
    invariant(typeof listener === 'function', 'listener must be a function.')
    let previousState = this.store.getState().forms[name]
    const handleChange = () => {
      const nextState = this.store.getState().forms[name]
      if (nextState?.initialized === previousState?.initialized) {
        return
      }
      previousState = nextState
      nextState && listener(nextState)
    }

    return this.store.subscribe(handleChange)
  }

  subscribeToFormValuesChange(name: string, listener: FormValueChangeListener): Unsubscribe {
    invariant(typeof listener === 'function', 'listener must be a function.')

    let previousState = this.store.getState().forms[name]?.value
    const handleChange = () => {
      const nextFormState = this.store.getState().forms[name];
      const nextState = nextFormState?.value
      if (nextState === previousState || !nextFormState) {
        return
      }
      previousState = nextState
      listener(nextState)
    }

    return this.store.subscribe(handleChange)
  }

  setFieldDefaultValue(formName: string, fieldPath: string, value: unknown): void {
    const payload: SetFieldValuePayload = {
      formName,
      path: fieldPath,
      value
    }
    this.dispatch(
      {
        type: SET_FIELD_DEFAULT_VALUE,
        payload: payload,
      }
    )
  }

  setFieldInitialValue(formName: string, fieldPath: string, value: unknown): void {
    const payload: SetFieldValuePayload = {
      formName,
      path: fieldPath,
      value
    }
    this.dispatch(
      {
        type: SET_FIELD_INITIAL_VALUE,
        payload: payload,
      }
    )
  }

  setFieldValue(formName: string, fieldPath: string, value: unknown): void {
    const payload: SetFieldValuePayload = {
      formName,
      path: fieldPath,
      value
    }

    this.dispatch(
      {
        type: SET_FIELD_VALUE,
        payload: payload,
      }
    )
  }

  setFieldState(formName: string, fieldState: FieldState): void {
    const payload: SetFieldStatePayload = {
      formName,
      path: fieldState.path,
      fieldState: fieldState
    }
    this.dispatch(
      {
        type: SET_FIELD_STATE,
        payload: payload,
      }
    )
  }


  inputFieldValue(formName: string, fieldPath: string, value: unknown): void {
    const payload: SetFieldValuePayload = {
      formName,
      path: fieldPath,
      value
    }

    this.dispatch(
      {
        type: INPUT_FIELD_VALUE,
        payload: payload,
      }
    )
  }


  getFormValue(formName: string): FormValue | undefined {
    return this.store.getState().forms[formName]?.value
  }

  getFormInitialValue(formName: string): FormValue | undefined {
    return this.store.getState().forms[formName]?.initialValue
  }
  getFormDefaultValue(formName: string): FormValue | undefined {
    return this.store.getState().forms[formName]?.defaultValue
  }

  getFieldState(formName: string, fieldPath: string): FieldState | undefined {
    const state = this.store.getState()
    return state.forms[formName]?.fields?.[fieldPath]
  }

  getFieldInitialValue(formName: string, fieldPath: string): unknown {
    const formState = this.getFormState(formName)
    if (formState) {
      const formHelper = new FormHelper(formState)
      return formHelper.getInitialValueByPath(fieldPath)
    }
  }

  getFieldDefaultValue(formName: string, fieldPath: string): unknown {
    const formState = this.getFormState(formName)
    if (formState) {
      const formHelper = new FormHelper(formState)
      return formHelper.getDefaultValueByPath(fieldPath)
    }
  }


  getFieldValue(formName: string, fieldPath: string) {
    const formState = this.getFormState(formName)
    if (formState) {
      const formHelper = new FormHelper(formState)
      return formHelper.getValueByPath(fieldPath)
    }
  }

  subscribeToFormChange(name: string, listener: FormChangeListener): Unsubscribe {
    invariant(typeof listener === 'function', 'listener must be a function.')

    let previousState = this.store.getState().forms[name]
    const handleChange = () => {
      const nextState = this.store.getState().forms[name]

      if (nextState === previousState) {
        return
      }
      previousState = nextState
      if (nextState) {
        listener(nextState)
      } else {
        console.error("can not find form")
      }
    }

    return this.store.subscribe(handleChange)
  }

  subscribeToFieldChange(formName: string, path: string, listener: FieldChangeListener): Unsubscribe {
    invariant(typeof listener === 'function', 'listener must be a function.')

    let previousState = this.store.getState().forms[formName]?.fields[path]
    const handleChange = () => {
      const nextState = this.store.getState().forms[formName]?.fields[path]
      if (nextState === previousState) {
        return
      }
      previousState = nextState
      listener(nextState)
    }

    return this.store.subscribe(handleChange)
  }

  subscribeToFieldValueChange(formName: string, fieldPath: string, listener: FieldValueChangeListener): Unsubscribe {
    invariant(typeof listener === 'function', 'listener must be a function.')
    const previousFormValue: FormValue | undefined = this.store.getState().forms[formName]?.value
    const formState = this.getFormState(formName)
    const formHelper = formState ? new FormHelper(formState) : undefined

    const handleChange = () => {
      const nextFormValue = this.store.getState().forms[formName]?.value
      if (nextFormValue === previousFormValue) {
        return
      }
      const prevValue = formHelper?.doGetValueByPath(previousFormValue, fieldPath)
      const value = formHelper?.doGetValueByPath(nextFormValue, fieldPath)
      if (value !== prevValue) {
        listener(value, prevValue)
      }
    }

    return this.store.subscribe(handleChange)
  }

  dispatch(action: IAction<FormActionPayload>): void {
    this.store.dispatch(action)
  }

  public getSubFields(formName: string, path: string) {
    const fieldPaths: string[] = []
    const fields = this.store.getState().forms[formName]?.fields
    for (const key of Object.keys(fields || {})) {
      if (key.startsWith(path)) {
        const name = key.substring(path.length + 1)
        if (name && name.indexOf(".") === -1) {
          fieldPaths.push(key)
        }
      }
    }
    return fieldPaths
  }
}

function makeStoreInstance(debugMode: boolean): Store<State> {
  // TODO: if we ever make a react-native version of this,
  // we'll need to consider how to pull off dev-tooling
  const reduxDevTools =
    typeof window !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
  return configureStore(
    {
      reducer: reduce,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
      devTools: debugMode &&
        reduxDevTools &&
        reduxDevTools({
          name: 'dnd-core',
          instanceId: 'dnd-core',
        }),
    }
  )
}

