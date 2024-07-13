export function capitalizeName(name: string) {
    const promise = new Promise((resolve, reject) => {

        console.log(name)
        const uppercaseName: string = '';
        const exceptions: string[] = [
            'van', 'der', 'den', 'de', 'of', 'the', 'and', 'jr', 'jr.'
        ]
        const nameSections: string[] = name.split(' ');
        console.log(nameSections)
        const nameSectionsLowerCase: string[] = []
        nameSections.forEach((section: string) => {
            nameSectionsLowerCase.push(section.toLowerCase())
        })
        console.log(nameSectionsLowerCase)
        const upperCasedSections: string[] = []
        nameSectionsLowerCase.forEach((section: string) => {

            if (!exceptions.includes(section)) {
                section = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase()
                upperCasedSections.push(section)
            } else {
                upperCasedSections.push(section.toLowerCase());
            }
        })
        const upperCaseName = upperCasedSections.join(' ')
        resolve(upperCaseName)
    })
    return promise
}
