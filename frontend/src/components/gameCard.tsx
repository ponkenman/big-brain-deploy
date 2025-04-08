export default function GameCard(props: {title: string, numQuestions: number, totalDuration: number}) {
    return (<article>
    <p>{props.title}</p>
    <p>{props.numQuestions} Questions</p>
    <p>{props.totalDuration} seconds</p>
    <img src="" alt={`Thumbnail for ${props.title}`}></img>
    <button type="button">Edit game</button>
    <button type="button">Delete game</button>
    </article>);
}