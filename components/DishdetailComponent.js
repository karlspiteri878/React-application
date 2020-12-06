import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Alert, PanResponder } from 'react-native';
import { Card, Icon, Input, Rating, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite} from '../redux/ActionCreators';
import { postComment} from '../redux/ActionCreators';
import  * as Animatable from 'react-native-animatable';
const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {

    const dish = props.dish;
    handleViewRef = ref=> this.view = ref;

    const recognizeDrag = ({moveX, moveY, dx, dy}) =>{
        if ( dx < -200 )
            return true;
        else
            return false;


    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) =>{
            return true;
        },
        onPanResponderGrant: () =>  {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished? 'finished': 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState)=>{
            if(recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add ' + dish.name +
                    ' to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? console.log('Already favorite') : props.onPress(),
                            style: 'cancel'
                        }
                    ],
                    {cancelable: false}
                )
            return true;
        }

    });
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                    ref={this.handleViewRef}
                    {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.onPressComment()}
                        />
                </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props){
    const comments = props.comments;
    const renderCommentItem = ({item, index}) =>{
        return(
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }
    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    
                    keyExtractor={console.log((item) => item.id.ToString())}
                    />
            </Card>
        </Animatable.View>
    );
}
class Dishdetail extends Component {
    constructor(props){
        super(props);
        this.state ={
            rating : 3,
            author: '',
            comment: '',
            showModal : 'false'
            
        };
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    toggleModal(){
        this.setState({ showModal: !this.state.showModal});
    }
    submitComment(dishId){
        console.log(dishId);
        console.log(this.state.author);
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
        this.resetForm;
    }
    resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        });
    }
    static navigationOptions = {
        title: 'Dish Details'
    };



    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        console.log('rendering');
        console.log(this.props);
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressComment={()=> this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}/>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal() }
                    onRequestClose={() =>{ this.toggleModal(); this.resetForm()}}
                    >
                    <View style={styles.modal}>
                        <View style={styles.modalText}>
                            <Rating type='star' imageSize={60} ratingCount={5}  showRating fractions="{0}" startingValue="{1}"
                             onValueChange={(itemValue, itemIndex) => this.setState({rating: itemValue})}></Rating>
                        </View>
                        <View style={styles.modalText}>
                            <Input
                                placeholder=' Author'
                                leftIcon={{ type: 'font-awesome', name: 'user' }}
                                onChangeText={(value) => this.setState({author: value})}
                                />
                        </View>
                        
                        <View style={styles.modalText}>
                            <Input
                                placeholder=' Comment'
                                leftIcon={{ type: 'font-awesome', name: 'comment' }}
                                onChangeText={(value) => this.setState({comment: value})}
                                />
                        </View>
                        <View style={styles.modalText}>
                            <Button
                                raised
                                title='Submit'
                                onPress={() => this.submitComment(dishId)}
                                accessibilityLabel='Learn more about this button'
                                />
                        </View>
                        <View style={styles.modalText}>
                            <Button
                                raised
                                title='CANCEL'
                                onPress={() => {this.toggleModal(); this.resetForm();}}
                                color='#512DA8'
                                accessibilityLabel='Learn more about this button'
                                />
                        </View>    
                    </View>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);