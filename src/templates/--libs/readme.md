<!-- 

// THIS IS A LIB UTILITY TEMPLATE FOR LOGGER
// We have LOGGER code that can be inserted into any component
// Only import lib here so that there is no syntax error.
// This component has no other use than just copying some section of it to the comp.tsx while compilation

// see: @BRO:LIBS:LOGGER--BASIC:START ~~ {code} ~~ @BRO:LIBS:LOGGER-BASIC:END
// the code in between will be taken and inserted whereever we find @BRO:LIBS:LOGGER-BASIC in comp.tsx


// The file name should match @BRO:LIBS:{FILE-NAME}--variation
// ex: LOGGER.tsx => @BRO:LIBS:LOGGER--BASIC, LOGGER--PROP-CHANGED 


inside comp.tsx

Rules
=====
1. If we have @BRO:LIBS:LOGGER--BASIC we will straight away copy the code inside the comp.tsx
2. If we have only the prefix @BRO:LIBS:LOGGER we will use attrs in the component|model node to see if we need to import any lib
3. On top of it th COMPILER can decide what else to import from the lib whenever required

Ex:

const GET_MANY = (props: any) => {

    // @BRO:LIBS:LOGGER--PROP-CHANGED
    // specific slot: here prop changed log will appear even if it's not in the model.attrs


    // @BRO:LIBS:LOGGER
    // general slot: if models.attrs has any utility code from LOGGER lib it will be inserted here

    return (<jsx></jsx>)
}


-->