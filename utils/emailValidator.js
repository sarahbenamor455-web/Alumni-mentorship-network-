const isEduEmail = (email) => {
    if (typeof email !== 'string') return false

    const parts = email.trim().toLowerCase().split('@')

    if (parts.length !== 2 || parts[0] === '') return false

    const domain = parts[1]
    return domain.endsWith('.edu') || domain.endsWith('.edu.tn')
}

module.exports = { isEduEmail }