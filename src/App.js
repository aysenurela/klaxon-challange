import React from 'react';
import './App.css';
import { content } from './content'
import { multipleSelectionContent } from './multipleSelectionContent'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeButton: -1,
      passQuestion : false,
      showMultipleSelection: false,
      isAnswerSelected: false,
      selectedAnswerId: null,
      isSubmitted: false,
    }
  }

  handleClick (ind, contentsLen) {
    this.setState({activeButton:ind})

    if (contentsLen-1 === ind) {
      this.setState({passQuestion: true})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.activeButton !== this.state.activeButton) {
      const _audio = document.getElementById("myAudio")
      _audio.play()
    }

    const activatedButton = document.getElementById(`${this.state.activeButton+1}`)
    if (activatedButton) {
      activatedButton.classList.remove("passiveState")
      activatedButton.classList.add("activeState")
    }
  }

  changeQuestion (text) {
    if (text === "multipleSelection") {
      this.setState({showMultipleSelection: true})
    } else {
      this.setState({showMultipleSelection: false})
    }
  }

  pickAnswer (id) {
    this.setState({ 
      isAnswerSelected: true,
      selectedAnswerId: id 
    })
  }

  onSubmit () {
    this.setState({ isSubmitted:true })
  }

  render () {
    const contents = [...content.icerikler]
    const activeButton = this.state.activeButton
    const selectedButton = contents[activeButton]

    const multipleSelectionContents = {...multipleSelectionContent}

    const {
      showMultipleSelection,
      passQuestion,
      isAnswerSelected,
      selectedAnswerId,
      isSubmitted
    } = this.state

    return (
      <div className="container">
        { !showMultipleSelection ?
        <div className="buttonsContainer">
          <audio id="myAudio" src={selectedButton ? selectedButton.ses : "" }/>
          <div className="buttonContainer">
            {contents.map((content, index)=>{
                return (
                  <button 
                    key={index}
                    id={index}
                    className={`contentButton ${index === 0 ? 'activeState' : 'passiveState'}`}
                    onClick={this.handleClick.bind(this, index, contents.length)}
                    disabled={index === activeButton || index-1 === activeButton || index < activeButton ? false : true }>
                      {content.buton}
                    </button>
                )
              })}
          </div>
          <div className="imageContainer">
            <img alt="" src={selectedButton ? selectedButton.gorsel : "" }></img>
        </div>
        </div> : (
        <div className="multipleChoicesContainer">
          <div className="question">{multipleSelectionContents.question}</div>
          <div className="answers">
          {multipleSelectionContents.answers.map((answer,ind)=>{
            return (
              <li key={ind} className="answerListItem">
                <button 
                  key={ind}
                  onClick={this.pickAnswer.bind(this, answer.id)}
                  className={
                    `contentButton answerButton 
                    ${isAnswerSelected ? 
                      (selectedAnswerId === answer.id ? 
                        (`selectedAnswer ${isSubmitted && multipleSelectionContents.rightAnswer === answer.id ? "isTrue" : ""}`) :
                        "notSelectedAnswer") :
                      "" }`}>
                  {answer.text}
                </button>
              </li>
            )
          })}
          </div>
          {isAnswerSelected && !isSubmitted &&
            <button 
              className="contentButton submitAnswer" 
              onClick={this.onSubmit.bind(this)}> 
                Cevap Ver 
            </button>}
          {isSubmitted && 
            <p className={`feedback `}> {multipleSelectionContents.rightAnswer === selectedAnswerId ? 
              "Tebrikler! Cevabınız doğru." :
              "Maalesef yanlış cevap verdiniz. Doğru cevap 'Rüzgarlı havalarda' olmalıydı."} 
            </p>}
        </div>
        )}
        {passQuestion && <div className="passContainer">
          <button className='contentButton passButton' onClick={this.changeQuestion.bind(this, "cars")}>Geri Dön</button>
          <button className='contentButton passButton' onClick={this.changeQuestion.bind(this, "multipleSelection")}>İlerle</button>
        </div>}
      </div>
    )
  }
}

export default App;
