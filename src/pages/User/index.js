import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Loading,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: true,
        page: 1,
    };

    async componentDidMount() {
        this.load();
    };

    load = async (page = 1) => {
        const { stars } = this.state;
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`users/${user.login}/starred`, {
            params: { page }
        });

        this.setState({
            stars: [...stars, ...response.data],
            loading: false,
            page,
        });
    };

    loadMore = () => {
        const { page } = this.state;

        const nextPage = page + 1;

        this.load(nextPage);
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;

        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>

                {loading ? (
                    <Loading />
                ) : (
                    <Stars
                    data={stars}
                    onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
                    onEndReached={this.loadMore} // Função que carrega mais itens
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred>
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                    />
                )}

            </Container>
        );
    }
}
