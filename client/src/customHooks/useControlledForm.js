import _ from "lodash"

import { useEffect, useState } from "react";

const useControlledForm = (props) => {

    const [form, setForm] = useState({
        values: props.initState.defaultValue ? (() =>{
            const { schema, defaultValue } = props.initState
            const keys = Object.keys(defaultValue)
            return _.mapValues(schema, (value, key) =>
            _.includes(keys, key) ? defaultValue[key] : schema[key]
          )
        })() : props.initState.schema,
        errors: false,
        serverErrorsObject: false,
        serverErrorsArray: false,
        isValid: false,
        handleSubmit: props.onSubmit && (async (e) => {
            e.preventDefault()
            setForm((state) => {
                props.onSubmit(e, state.values).catch((errors) => {
                    setForm((state) => {
                        state.serverErrorsArray = errors     
                        state.serverErrorsObject = errors.reduce((acc, curr) => {
                            acc[curr.field] = true;
                            return acc;
                          }, {});
                        return {...state}
                    })
                })
                return {...state}
            })

            
        }),
        handleChange: (e) => {
            let value = ""
            switch(e.target.type){
                case 'checkbox': 
                    value = !(e.target.value === "true");
                    break;
                case 'file': 
                    value = e.target.files.length > 1 ? e.target.files : e.target.files[0]
                    break;
                default: 
                    value = e.target.value;
                    break;
            }
            setForm((state) => {
                state.values = {...state.values, [e.target.name]: value};
                return { ...state };
            });
        }

    });

    useEffect(() => {
        
        if(props.validation){
            setForm((state) => {
                const clientErrors = props.validation(state.values)
                console.log(clientErrors)
                state.errors = {...state.serverErrorsObject, ...clientErrors}
                state.isValid = (Object.keys(clientErrors).length === 0) ? true : false
                return {...state}
            })
        }  
    }, [form.values, form.serverErrorsObject])

    useEffect(() => {  
        if(props.customs){
            setForm((state) => {
                const customs = _.mapValues(props.customs, (value, key) => function() {
                    setForm((state) => {
                        state.values = {...value(state.values, ...arguments)}
                        return {...state}
                        })
                    })
                return {...state, ...customs};
            });   
        }
    }, [])

    
    useEffect(() => {
        console.log(form)
    }, [form])
    
    

    
    return form;

}

export default useControlledForm