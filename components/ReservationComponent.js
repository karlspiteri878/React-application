import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, Switch,Picker, Button, Modal,Alert, ScrollView, } from 'react-native';
import { Card } from'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import  * as Animatable from 'react-native-animatable';
import{ Notifications } from'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import Moment from 'moment';
class Reservation extends Component{

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            showModal: false,
            show:false,
            mode: 'date'
        }
    }
    
    
handleReservation() {
        const date = this.state.date;
        Alert.alert(JSON.stringify(this.state));
        this.obtainCalendarPermission();
        this.addReservationToCalendar(date);
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            showModal: false,
            show:false,
            mode: 'date'
        });
    }
    static navigationOptions ={
        title: 'Reserve Table',
    };
    toggleModal(){
        this.setState({ showModal: !this.state.showModal});
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            mode: 'date',
            date: new Date(),
            showModal: false,
            show: false
        });
    }
    async obtainNotificationPermission(){
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS)
        if ( permission.status !== 'granted'){
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if(permission.status !== 'granted'){
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date){
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: ' Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }
    async obtainCalendarPermission(){
        const calendarPermission = await Calendar.requestCalendarPermissionsAsync();

    }
    
    async addReservationToCalendar(date){

        await this.obtainCalendarPermission();
  
        let dateMs = Date.parse(date);
        
        let startDate = new Date(dateMs);
        
        let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);
        
        const defaultCalendarSource =
        
        Platform.OS === 'ios'
        
        ? await getDefaultCalendarSource()
        
        : { isLocalAccount: true, name: 'Expo Calendar' };
        let details ={
            title: 'Con Fusion Table Reservation',
  
            source: defaultCalendarSource,
            
            name: 'internalCalendarName',
            
            color: 'blue',
            
            entityType: Calendar.EntityTypes.EVENT,
            
            sourceId: defaultCalendarSource.id,
            
            ownerAccount: 'personal',
            
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        }
        const calendarId = await Calendar.createCalendarAsync(details);

        await Calendar.createEventAsync(calendarId , {

            title: 'Con Fusion Table Reservation',
            
            startDate: startDate,
            
            endDate: endDate,
            
            timeZone: 'Asia/Hong_Kong',
            
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
            
            });
    }

            
    render(){
        return(

            <ScrollView>
                 <Animatable.View animation="zoomIn">
                <View Style={styles.formRow}>
                    <Text style={styles.formLabel}>
                        Number of Guests
                    </Text>
                    <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    onTintColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value})}>
                </Switch>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}onPress={() => this.setState({ show: true, mode: 'date' })}>Date and Time</Text>
                {/* Date Time Picker */}
                {this.state.show && (
                    <DateTimePicker
                        value={this.state.date}
                        textcolor="blue"
                        mode={this.state.mode}
                        placeholder={this.state.date}
                        minimumDate={new Date()}
                        minuteInterval={30}
                        onChange={(event, date) => {
                            if (date === undefined) {
                                this.setState({ show: false });
                            }
                            else {
                                this.setState({
                                    show: this.state.mode === "time" ? false : true,
                                    mode: "time",
                                    date: new Date(date)
                                });
                            }
                        }}
                    />
                )}
                </View>
                <View Style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation(this.state.guests,this.state.smoking, this.state.date)}
                        title='Reserve'
                        color='#512DA8'
                        accessibilityLabel='Learn more about this purple button'
                        />
                </View>
                </Animatable.View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem:{
        flex: 1
    },
    modal : {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight:'bold',
        backgroundColor:'#512DA8',
        textAlign: 'center',
        color:'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default Reservation;