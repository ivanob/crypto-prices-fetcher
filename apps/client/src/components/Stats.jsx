
export const Stats = ({stats}) => {
    if(!stats) return null;
    return (
        <div>
            <h3>Crypto stats</h3>
            <table>
                <tr>
                    <th>Crypto</th>
                    <th>highest value</th>
                    <th>Lowest value</th>
                    <th>Number of readings</th>
                </tr>
            {stats.map(cryptoStats =>
                <tr>
                    <td>{cryptoStats.crypto}</td>
                    <td>{cryptoStats.highestPrice}</td>
                    <td>{cryptoStats.lowestPrice}</td>
                    <td>{cryptoStats.numberOfReadings}</td>
                </tr>
            )}
            </table>
        </div>
    )
}