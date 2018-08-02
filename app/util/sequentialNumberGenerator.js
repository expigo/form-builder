export default function* seqNumGen(startingNumber) {
    let counter = startingNumber || 1;
    while(true) {
        yield (counter++);
    }
}