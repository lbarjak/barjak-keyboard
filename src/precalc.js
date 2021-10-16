import BufferPlayer from './bufferplayer.js'

export default class Precalc {
    precalc = (selectedOctave, selectedInst) => {
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTrisF = () => {
            return (
                2 +
                2 *
                    Math.round(
                        numberOfVerticalTrisMax *
                            (Math.sqrt(3) / 2) *
                            (window.innerWidth / window.innerHeight)
                    )
            )
        }
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitchesF = () => {
            return (
                numberOfHorizontalTris - 1 + (numberOfVerticalTrisMax - 1) * 6
            )
        }
        let countOfPitches = countOfPitchesF()
        let soundsOfInst =
            BufferPlayer.instruments[selectedInst].max -
            BufferPlayer.instruments[selectedInst].min +
            1 -
            12 * selectedOctave
        if (countOfPitches > soundsOfInst - 1) {
            while (countOfPitches > soundsOfInst - 1) {
                numberOfVerticalTrisMax--
                numberOfHorizontalTris = numberOfHorizontalTrisF()
                countOfPitches = countOfPitchesF()
            }
            numberOfVerticalTrisMax++
            numberOfHorizontalTris = numberOfHorizontalTrisF()
        }
        return numberOfVerticalTrisMax
    }
}
