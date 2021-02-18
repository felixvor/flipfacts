  

const assumptionScore = (posSources, negSources) => {

    let posScore = 1
    let negScore = 1

    if (posSources){
        for(let i = 0; i < posSources.length; i++){
            let source = posSources[i]
            posScore += Math.pow(2, Math.log(source.citations))
        }
    }
    if (negSources){
        for(let i = 0; i < negSources.length; i++){
            let source = negSources[i]
            negScore += Math.pow(2, Math.log(source.citations))
        }
    }
    
    return (posScore / (posScore+negScore)) * 100
}

export default assumptionScore