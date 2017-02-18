import React from 'react'
import { Link } from 'react-router'

const sepWith = (delimiter) => (componentArray) => {
    let result = []
    componentArray.forEach((comp,i) => {
      result.push(comp)
      result.push(<span key={'sepWith' + i}> {delimiter} </span>)
    })
    result.pop()
    return result
}

// TODO: use Formula.map (or something similar)
const Formula = ({ formula, link }) => {

    if (!formula) { return (<span/>) }

    // TODO: check formula type and make sure that we have attached ids
    if (formula.property) {
        var label = formula.property.name
        if (formula.value === false) {
            label = "¬" + label
        }
        if (link === false) {
            return <span>{label}</span>
        } else {
            return <Link to={"/properties/"+formula.property.name}>{label}</Link>
        }
    } else if (formula.and) {
        return (
            <span>({sepWith("∧")(formula.and.map((sf, i) =>
                <Formula key={i} formula={sf} link={link}/>
            ))})</span>
        )
    } else if (formula.or) {
        return (
            <span>({sepWith("∨")(formula.or.map((sf, i) =>
                <Formula key={i} formula={sf} link={link}/>
            ))})</span>
        )
    }
    return (<span/>)
}

export default Formula
