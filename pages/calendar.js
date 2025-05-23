const saveAndGoBack = async () => {
    try {
        await saveReminderByID(id, title, date, selectedTheme);
        navigation.navigate('Home', {
            shouldNavigateToReminder: true // bu sayede `reminder` sekmesi otomatik seçilir
        });
    } catch (error) {
        console.error('Error saving reminder:', error);
    }
};

const goBack = async () => {
    await saveAndGoBack();
}; 